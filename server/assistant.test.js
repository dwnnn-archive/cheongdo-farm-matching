import assert from "node:assert/strict";
import { Readable } from "node:stream";
import test from "node:test";
import { handleAssistantRequest } from "./assistant.js";

let requestNumber = 0;

function createRequest(url, method, body) {
  const content = body === undefined ? "" : JSON.stringify(body);
  const request = Readable.from(content ? [Buffer.from(content)] : []);
  request.url = url;
  request.method = method;
  request.headers = content ? { "content-length": Buffer.byteLength(content) } : {};
  request.socket = { remoteAddress: `192.0.2.${++requestNumber}` };
  return request;
}

function createResponse() {
  return {
    statusCode: 0,
    headers: {},
    body: "",
    writeHead(statusCode, headers) {
      this.statusCode = statusCode;
      this.headers = headers;
      return this;
    },
    end(body = "") {
      this.body = body.toString();
    },
    json() {
      return JSON.parse(this.body);
    },
  };
}

async function send(url, method, body) {
  const response = createResponse();
  const handled = await handleAssistantRequest(createRequest(url, method, body), response);
  return { handled, ...response };
}

const sampleJob = {
  id: "sample-1",
  title: "감 수확 보조",
  category: "수확",
  location: "화양읍",
  date: "11월 12일",
  start: "08:00",
  end: "17:00",
  pay: 100000,
};

test("assistant status reports configured providers without calling them", async () => {
  const result = await send("/api/assist/status", "GET");

  assert.equal(result.handled, true);
  assert.equal(result.statusCode, 200);
  assert.equal(typeof result.json().copilot, "boolean");
  assert.equal(typeof result.json().agentFramework, "boolean");
  assert.equal(result.headers["Cache-Control"], "no-store");
});

test("matching rejects email addresses before any provider call", async () => {
  const result = await send("/api/assist/match", "POST", {
    question: "연락은 worker@example.com 으로 주세요",
    jobs: [sampleJob],
  });

  assert.equal(result.statusCode, 400);
  assert.match(result.json().error, /이메일/);
});

test("posting rejects phone numbers before any provider call", async () => {
  const result = await send("/api/assist/posting", "POST", {
    title: "감 수확 보조",
    category: "수확",
    location: "화양읍",
    description: "문의 010-1234-5678",
  });

  assert.equal(result.statusCode, 400);
  assert.match(result.json().error, /전화번호/);
});

test("assistant endpoints reject malformed and oversized requests", async () => {
  const invalid = await send("/api/assist/match", "POST", {
    question: "이번 주",
    jobs: [],
  });
  assert.equal(invalid.statusCode, 400);

  const oversized = createResponse();
  const largeBody = JSON.stringify({ question: "a".repeat(9000), jobs: [sampleJob] });
  const request = Readable.from([Buffer.from(largeBody)]);
  request.url = "/api/assist/match";
  request.method = "POST";
  request.headers = { "content-length": Buffer.byteLength(largeBody) };
  request.socket = { remoteAddress: `192.0.2.${++requestNumber}` };
  await handleAssistantRequest(request, oversized);

  assert.equal(oversized.statusCode, 400);
  assert.match(oversized.json().error, /너무 큽니다/);
});
