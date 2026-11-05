---
name: "일손이음"
description: "청도 농촌 일자리의 조건을 기록하고 연결하는 모바일 친화형 서비스."
colors:
  paper: "#faf6f5"
  paper-green: "#eef3ef"
  ink: "#16181a"
  muted: "#585a5d"
  line: "#c9c7c4"
  registration-lilac: "#66688f"
  registration-lilac-pale: "#dcdcf0"
  success: "#285d46"
  danger: "#a4352b"
  white: "#ffffff"
typography:
  display:
    fontFamily: "Pretendard, Apple SD Gothic Neo, Malgun Gothic, sans-serif"
    fontSize: "clamp(26px, 2.3vw, 33px)"
    fontWeight: 760
    lineHeight: "1.2"
    letterSpacing: "-0.045em"
  title:
    fontFamily: "Pretendard, Apple SD Gothic Neo, Malgun Gothic, sans-serif"
    fontSize: "17px"
    fontWeight: 700
    lineHeight: "1.4"
  body:
    fontFamily: "Pretendard, Apple SD Gothic Neo, Malgun Gothic, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "1.6"
  label:
    fontFamily: "ui-monospace, SFMono-Regular, Consolas, monospace"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: "1.35"
    letterSpacing: "0.015em"
rounded:
  none: "0"
  circle: "50%"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "34px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
    rounded: "{rounded.none}"
    padding: "11px 13px"
    height: "47px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0 14px"
    height: "40px"
  input-search:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0 11px"
    height: "42px"
---

# Design System: 일손이음

## Overview

**Creative North Star: "농촌 작업대의 기록판"**

일손이음은 온백색 작업면, 기록 먹색 글자, 등록 라일락 표식을 사용해 농작업을 홍보 카드가 아닌 읽기 쉬운 작업 기록으로 다룹니다. 청년이 작업 내용과 일정, 급여를 빠르게 비교할 수 있도록 조건을 먼저 보여주고, 농가에는 같은 조건을 간결하게 등록하는 흐름을 제공합니다.

사용자가 선택한 인상은 기술적이고 대비가 분명한 도구입니다. 평면적인 면과 가는 선으로 구조를 만들고, 날짜와 예시 상태는 고정폭 글꼴로 구별합니다. 현재 앱은 프로토타입이며, 모든 예시 공고와 브라우저 내 변경 사항은 실제 모집이나 신청으로 오해되지 않도록 표시합니다.

**Key Characteristics:**
- 조건이 먼저 읽히는 작업 레코드
- 기록 먹색과 등록 라일락의 제한된 대비
- 날짜와 예시 상태에 쓰는 고정폭 라벨
- 그림자보다 얇은 선과 종이 톤으로 만드는 평면 구조
- 실제 정보와 체험용 예시를 구분하는 명시적 표식

## Colors

기록 먹색을 기본 잉크로 사용하고, 등록 라일락은 선택 및 등록 상태를 표시하며, 온백색 용지와 정보 녹색은 배경 역할을 맡습니다.

### Primary
- **기록 먹색** (#16181a): 기본 본문, 제목, 주 행동 버튼에 쓰는 가장 강한 잉크입니다.

### Secondary
- **등록 라일락** (#66688f): 등록 표식, 선택된 레코드, 포커스 윤곽과 예시 라벨에 제한적으로 씁니다.

### Tertiary
- **정보 녹색** (#eef3ef): 안내 배너와 작업 상세 면을 구분하는 차분한 표면색입니다.
- **완료 녹색** (#285d46): 신청 완료 등 성공 상태에 씁니다.
- **오류 적색** (#a4352b): 입력 오류 상태에만 씁니다.

### Neutral
- **온백색 용지** (#faf6f5): 기본 페이지 바탕입니다.
- **백색 카드** (#ffffff): 입력란과 작업 레코드의 표면입니다.
- **보조 잉크** (#585a5d): 설명, 메타 정보, 보조 라벨입니다.
- **규칙선 회색** (#c9c7c4): 경계와 구획선입니다.
- **연한 등록 라일락** (#dcdcf0): 선택 강조와 텍스트 선택 배경입니다.

### Named Rules
**The Ink and Registration Rule.** 작업 내용은 기록 먹색으로 읽히게 하고 등록 라일락은 상태를 구분하는 표식으로 아껴 씁니다. 정보 녹색은 안내 면에만 사용합니다.

## Typography

**Display Font:** Pretendard (with Apple SD Gothic Neo and Malgun Gothic fallbacks)<br>
**Body Font:** Pretendard (with Apple SD Gothic Neo and Malgun Gothic fallbacks)<br>
**Label/Mono Font:** `ui-monospace`, SFMono-Regular, Consolas, monospace

**Character:** 한글 제목과 본문은 단정한 고딕 계열로 빠르게 읽히게 합니다. 날짜, 시간, 예시 상태는 고정폭 라벨과 숫자 정렬로 레코드의 조건임을 분명히 합니다.

### Hierarchy
- **Display** (760, 26px mobile / `clamp(26px, 2.3vw, 33px)`, 1.2): 현재 페이지의 주 제목.
- **Title** (700, 17–20px, 1.4): 작업명과 상세 패널 제목.
- **Body** (400, 12–14px, 1.6): 설명, 위치, 보조 안내.
- **Label** (400, 10–11px, 1.35, 고정폭): 작업 날짜, 근무 시간, 급여 구분, 예시 상태.

## Layout

데스크톱 작업 공간은 76px 상단 바 아래에 왼쪽 220px 탐색, 가운데 유동 폭 공고 목록, 오른쪽 285px 상세 패널을 둡니다. 1240px 이하에서는 좌우 패널을 줄이고 공고 행동을 다음 줄로 옮깁니다. 980px 이하에서는 상세 패널을 본문 아래로 내립니다. 700px 이하에서는 목록·상세·공고 등록을 각각 한 화면으로 전환하고, 목록에서는 하단 모바일 탐색을 사용합니다. 상세와 등록 화면에는 목록으로 돌아가는 상단 동작을 두며, 신청 버튼은 엄지로 닿기 쉬운 화면 아래쪽에 둡니다. 상단과 하단은 기기 안전 영역을 반영합니다.

본문은 제목, 체험용 정보 배너, 검색·필터, 공고 레코드 순으로 읽힙니다. 데스크톱 첫 화면에는 두 공고를 우선 보여주고 나머지는 명시적인 더 보기 행동 뒤에 둡니다. 간격은 8px 단위의 작은 리듬을 바탕으로 하며, 작업 조건을 서로 비교할 수 있도록 레코드의 날짜·시간·급여 열을 정렬합니다.

## Elevation & Depth

기본 화면은 평면입니다. 사용자가 선택한 깊이감은 얇은 선과 종이 톤의 차이이며, 카드나 패널을 띄우는 구조적 그림자는 사용하지 않습니다. 선택된 레코드는 라일락 테두리로, 상세 면은 옅은 정보 녹색으로 구분합니다. hover 상태는 배경과 테두리의 미세한 변화로 전달합니다.

## Shapes

입력, 공고 레코드, 버튼은 대부분 모서리가 각진 사각형입니다 (`border-radius: 0`). 원형은 등록을 알리는 샘플 씰과 작은 브랜드 표식처럼 등록 인쇄 모티프에만 사용합니다. 선은 얇고 중립적이며, 레코드의 모서리에는 작은 등록 표식을 둡니다.

## Components

### Buttons
- **Shape:** 각진 사각형 (0px).
- **Primary:** 기록 먹색 면과 백색 글자, 47px 높이. 신청과 공고 등록처럼 주요 작업에 씁니다.
- **Secondary:** 투명 면과 규칙선 테두리. 필터 보조 행동과 되돌아가기에 씁니다.
- **Hover / Focus:** hover에서는 면 또는 테두리를 조금 바꾸고, 키보드 포커스에는 3px 라일락 윤곽을 사용합니다.

### Chips
- **Style:** 체험용 예시는 작은 고정폭 글자와 연한 라일락 바탕·테두리로 표시합니다. 사용자 등록 공고는 녹색 상태 표식으로 구분합니다.
- **State:** 상태 설명을 유지하며 작업 종류 필터와 혼동되지 않게 합니다.

### Cards / Containers
- **Corner Style:** 각진 모서리 (0px).
- **Background:** 작업 레코드는 백색, 기본 화면은 온백색 용지, 상세 패널은 정보 녹색.
- **Shadow Strategy:** 기본 그림자 없음. 선택 상태는 등록 라일락 테두리로 표현합니다.
- **Border:** 1px 규칙선 회색; 선택 레코드는 등록 라일락.
- **Internal Padding:** 데스크톱 레코드는 최소 152px 높이와 23–24px 안쪽 여백을 사용합니다.

### Inputs / Fields
- **Style:** 백색 바탕, 1px 규칙선, 0px 모서리, 42px 높이.
- **Focus:** 3px 라일락 포커스 윤곽과 3px 간격.
- **Error / Disabled:** 오류는 적색 문구와 옅은 따뜻한 면으로, 완료된 신청은 성공 녹색으로 표시합니다.

### Navigation
- **Style:** 데스크톱은 좌측 텍스트 탐색, 모바일은 하단 고정 탐색입니다. 현재 위치는 옅은 라일락 면과 먹색 글자로 표시합니다.
- **Role Switch:** 농가와 청년 모드는 얇은 사각 테두리 안의 선택 버튼으로 바꿉니다.

### Sample Seal
원형 씰은 예시 공고임을 알리고 선택된 작업의 상태를 보조합니다. 글자는 중앙에 두고, 가는 라일락 테두리와 느린 회전으로 종이 등록 인쇄의 성격을 더합니다. 색상만으로 예시 여부를 전달하지 않고 텍스트 라벨을 함께 둡니다.

## Do's and Don'ts

### Do:
- **Do** 작업명, 날짜, 시간, 일급을 공고 레코드에서 한눈에 비교할 수 있게 유지합니다.
- **Do** 예시 공고와 브라우저 안에서만 저장되는 상태를 명확한 문구로 표시합니다.
- **Do** 등록 라일락은 선택·등록 표식에, 정보 녹색은 안내 표면에 사용합니다.
- **Do** 키보드 포커스가 라일락 윤곽으로 보이게 유지합니다.

### Don't:
- **Don't** 체험용 공고를 실제 모집이나 검증된 지역 프로그램처럼 표현하지 않습니다.
- **Don't** 날짜·급여 같은 작업 조건을 추상적인 장식이나 긴 홍보 문구보다 뒤에 숨기지 않습니다.
- **Don't** 실제 코드에 없는 색상, 그림자, 브랜드 자산을 디자인 토큰으로 추가하지 않습니다.
- **Don't** 단순한 표면에 강한 입체감이나 과한 모서리 곡률을 더하지 않습니다.
