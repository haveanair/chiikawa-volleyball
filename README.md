# 치이카와 배구 (Chiikawa Volley) · 무료 웹 배구 게임

**[치이카와 배구 / Play Chiikawa Volley — 웹에서 바로 플레이](https://haveanair.github.io/chiikawa-volleyball/)**

PC·모바일 브라우저에서 무료로 즐기는 치이카와 배구 팬게임입니다. / A free Chiikawa Volley fan game for desktop and mobile browsers.

**작은 친구들의 큰 승부! 치이카와 친구들과 함께하는 비영리 2차 창작 배구 팬게임입니다.**

치이카와, 하치와레, 우사기를 비롯한 다양한 캐릭터를 골라 배구 대결을 즐겨 보세요. 하모 아요 배구 GBA와 피카츄배구의 경쾌한 게임성을 바탕으로, 캐릭터별 연출과 초필살기, 스토리 모드를 더했습니다.

- **스토리 모드:** 하치와레의 집에서 세이렌의 동굴까지 이어지는 5개 스테이지
- **다양한 캐릭터:** 주인공 친구들부터 파자마파티즈, 한잎이·두잎이, 곤충몬스터, 데카츠요, 세이렌까지
- **대전:** 친구와 로컬 2인 대전, 자유롭게 상대를 고르는 컴퓨터 대전, 숫자 4자리 방 번호로 연결하는 온라인 친구 대전
- **초필살기:** 공을 10번 튕겨 게이지를 채운 뒤 상단 스파이크를 맞히면 발동
- **모바일 조작:** 스토리·온라인은 왼쪽 이동·점프와 오른쪽 공격. 로컬 2인 대전은 양쪽에 각각 이동·점프·공격 패드 제공
- **경기 전 대화:** 선택한 주인공과 상대가 코트에 등장하고 하단에서 대화를 주고받습니다. 마지막 대사 뒤 준비 연출을 거쳐 경기가 시작되며 스킵·Esc도 지원합니다. 원작의 관계·말투에 기반한 게임용 각색입니다.
- **타이틀 데모:** 타이틀 20초와 CPU 자동 경기 20초가 번갈아 재생되고, 1~5스테이지를 순환
- **한국어 / 영어:** 타이틀 화면에서 언어 변경

현재 개발 중인 **웹 버전**이며 처음에는 치이카와·하치와레·우사기를 선택할 수 있습니다. 나머지 캐릭터는 도전과제로 해금됩니다. 웹과 GBA는 C 언어 경기 코어를 공유합니다. **[GBA v0.5.5 다운로드 / 배포 안내](https://github.com/haveanair/chiikawa-volleyball/tree/main/gba)**에서 잠금판과 전체 해금판을 받을 수 있습니다.

**[GBA판 다운로드 / GBA downloads](https://github.com/haveanair/chiikawa-volleyball/releases/tag/gba-v0.5.5) · [GBA 전용 안내 / GBA guide](https://github.com/haveanair/chiikawa-volleyball/tree/main/gba)**

### 플레이 및 조작

웹 주소: https://haveanair.github.io/chiikawa-volleyball/

온라인 대전은 한 명이 방을 만들고, 친구가 같은 4자리 방 번호를 입력해 참가한 뒤 방장이 시작합니다.

| 조작 | 1P | 2P | 스마트폰 |
|---|---|---|---|
| 좌우 이동 | A / D | ← / → | 왼쪽 ◀ / ▶ |
| 점프 | W | ↑ | 왼쪽 ▲ |
| 공격 | F | Enter | 공격 |
| 상단 스파이크 | W + F | ↑ + Enter | ▲ + 공격 |

스마트폰 한 대로 둘이 하려면 **게임 시작 → 2인 대전 → 1P 결정 → 2P 결정** 순서로 진행하세요. 가로로 놓으면 1P는 화면 왼쪽, 2P는 오른쪽의 패드로 각각 이동·점프·공격할 수 있습니다. 양쪽 패드는 위에서부터 **공격 → 점프(▲) → 좌우(◀ ▶)** 순서입니다. 공격과 점프를 동시에 눌러 상단 스파이크를 사용할 수 있습니다. 두 패드는 여러 손가락 입력을 독립적으로 처리합니다. 전체 화면은 선택 사항입니다. 2인 대전에서는 5개 배경을 자유롭게 고를 수 있습니다.

온라인에서는 **각자 자신의 기기에서 1P 조작(A/D/W/F 또는 1인용 터치 패드)**을 사용합니다. 한 명이 방 만들기, 다른 한 명이 4자리 번호로 참가한 뒤 방장이 대전 시작을 누르세요. 로컬 PC의 2P Enter 조작과 구별됩니다. 서로 같은 최신 버전으로 새로고침해 주세요.

온라인 입력은 변경 즉시 보내며, 전송이 밀릴 때 경기 상태는 최신 한 장만 남겨 오래된 화면이 계속 쌓이지 않도록 했습니다. 서버 중계·통신망 왕복 시간 자체는 남으므로 먼 거리나 불안정한 연결에서 모든 지연이 사라지는 것은 아닙니다. 가능하면 안정적인 Wi-Fi를 사용하고, 같은 장소라면 한 기기의 로컬 2인 대전으로 즐길 수 있습니다.

도전과제는 현재 브라우저에 저장됩니다. **도전과제·친구 해금 → 기록 백업 저장**으로 기록을 파일에 보관할 수 있습니다. **도전과제 초기화**는 확인 창에서 승인한 경우에만 기록과 캐릭터 해금을 지우며, 취소하면 유지합니다. 기기·브라우저를 바꾸면 자동으로 이전되지 않습니다.

타이틀 데모는 **타이틀 → 1스테이지 → 타이틀 → 2스테이지 → … → 5스테이지 → 타이틀 → 1스테이지** 순서입니다. 각 구간은 20초이며 데모 상단 중앙에 게임 로고가 깜빡입니다. 각 20초 데모는 앞부분의 **캐릭터 대화 자동 진행 → 준비 연출 → CPU 랠리**로 이어집니다. 긴 대화는 미리보기의 핵심 반응 4개로 줄이며, 실제 플레이에서는 전체 대화를 보여 줍니다. 코트 순서대로 치이카와/우사기, 치이카와/하치와레, 하치와레/우사기, 치이카와/한잎이·두잎이, 한잎이·두잎이/세이렌이 등장합니다. 대화 중에도 상단 중앙 로고가 깜빡이고, 기존 음성 설정을 따릅니다. 화면을 누르거나 키를 입력하면 대화·경기 어디서든 타이틀로 돌아갑니다. 데모는 도전과제 기록에 반영되지 않습니다. 데모 리시브는 상대 코트로 보내는 포물선을 사용해 양쪽이 번갈아 공을 주고받습니다.

경기 전 대화는 치이카와 포켓의 실제 장면·대사, 사용자가 제공한 위키 본문, 공식 소개를 참고해 원작의 관계와 말투를 유지한 **게임용 각색**입니다. 선택한 캐릭터에 따라 대사·외침·몸짓이 달라지며, 원작에서 실제로 배구 대화를 나눴다고 주장하지 않습니다. 원작에서 길게 말하지 않는 캐릭터에게 긴 대사를 붙이지 않고, 팬 추측을 확정 설정으로 쓰지 않습니다. [장면별 확인 자료](docs/story-sources.md)를 참고하세요.

모든 14개 선택 캐릭터는 1~5스테이지마다 서로 다른 첫 반응과 마무리 대사를 가집니다. 기본 스테이지 대화는 4·5·6·7·8차례로 달라지고, 먼저 반응하는 쪽과 대화 순서도 바뀝니다. 쿠리만쥬는 자신의 음성이 실제 재생되는 동안 전용 「캬」 표정으로 바뀌며, 재생 종료·다음 화자·스킵에서는 기본 표정으로 돌아옵니다.

포켓의 원작 클립을 대조한 **21개 전용 장면·10개 캐릭터 매칭**을 적용했습니다. 피자만두, 푸딩, 간질이기, 초밥과 와사비, 같은 무기, 라멘 주문 연습, 어묵, 파자마 외출, 첫 만남, 별똥별, 수상한 지팡이, 사타판빈, 도토리와 포셰트 등의 기억을 활용합니다. 주인공끼리는 같은 매칭도 선택 코트에 따라 다른 에피소드가 나옵니다. 회상 대사는 **원작 클립 · 자체 번역**, 배구로 이어지는 부분은 **게임용 각색**으로 구분합니다. 원작의 짧은 말과 컷 속 반응을 번역·요약한 것으로, 정식 한국어판 대사의 재현은 아닙니다. 인어섬의 세 조합은 직접적인 줄거리 설명 대신 치이카와의 망설임과 묻지 않는 선택, 두 친구가 손을 꼭 잡는 반응, 세이렌의 짧은 대답과 시선으로 구성했습니다. 실제 대전과 데모 양쪽에 적용됩니다.

경기 전 대사가 바뀔 때 현재 화자의 캐릭터 음성 클립을 재생합니다. 기존 음성이 없는 캐릭터는 GBA판의 캐릭터별 소리를 사용합니다. 문장 전체를 읽는 합성 더빙은 아닙니다. 다음 대사·준비 연출·스킵·Esc에서 이전 소리를 멈추며, 음성 켜짐/꺼짐 설정을 따릅니다.

**컴퓨터 대전:** 게임 시작 → 2인 대전 → 대전 상대를 **컴퓨터**로 변경 → 난이도 1~5와 배경 선택 → 내 캐릭터 결정 → 컴퓨터 캐릭터 결정 순서로 진행합니다. 컴퓨터는 2P를 자동 조작하고, 스마트폰에는 1인용 패드를 표시합니다. 친구로 되돌리면 양쪽 패드가 나타납니다. 자유 대전 기록은 스토리 도전과제에 반영되지 않습니다.

스토리뿐 아니라 친구·컴퓨터·온라인 대전에서도 **실제 캐릭터 매칭에 따른 상호작용**을 재생합니다. 치이카와/하치와레의 라멘, 치이카와/우사기의 피자만두, 하치와레/우사기의 파자마 에피소드와 인어섬 관련 조합 등은 전용 장면을 사용합니다. 전용 장면의 길이는 기본 스테이지 패턴과 다를 수 있습니다. 온라인은 양쪽이 대화 또는 스킵을 끝낼 때까지 기다린 뒤 함께 시작합니다. 통신 규약이 변경되었으므로 두 사람 모두 최신 페이지로 새로고침해 주세요.

### QR로 공유하기

게임을 소개할 때 아래 이미지를 저장하거나 링크해 사용할 수 있습니다. QR은 위 게임 주소로 바로 연결되며 별도 설치가 필요 없습니다.

[홍보 포스터 PNG · 1080×1600](docs/promo/chiikawa-volley-promo.png) · [QR 단독 PNG · 984×984](docs/promo/chiikawa-volley-qr.png) · [인쇄용 QR SVG](docs/promo/chiikawa-volley-qr.svg)

<a href="https://haveanair.github.io/chiikawa-volleyball/"><img src="docs/promo/chiikawa-volley-promo.png" alt="치이카와 배구 Chiikawa Volley — QR을 찍고 바로 플레이" width="480"></a>

---

**A little match with a big heart! A non-commercial, fan-made volleyball game featuring the world of Chiikawa.**

Choose Chiikawa, Hachiware, Usagi, and more for lively volleyball matches. Inspired by Hamo Ayo Volleyball for GBA and Pikachu Volleyball, the game adds character animations, special shots, and a five-stage story mode.

- **Story mode:** Five courts, from Hachiware’s home to Siren’s cave
- **Character roster:** Familiar friends, Pajama Parties, Hitohā and Futabā, the insect monster, Dekatsuyo, Siren, and more
- **Versus play:** Local friends, selectable CPU opponents with five difficulty levels, and online friend matches using a four-digit room code
- **Special shots:** Fill the gauge with 10 ball hits, then land an upward spike to unleash a special move
- **Mobile controls:** Solo/online: movement and jump on the left, attack on the right. Local versus: a complete independent pad for each player on one phone
- **Pre-match encounters:** Your chosen hero and opponent appear on the court, exchanging dialogue in a lower panel before a ready sequence starts the match. These are game adaptations based on the original personalities, with Continue and Skip buttons.
- **Attract loop:** 20-second title and CPU demo segments, cycling through stages 1–5 without changing saved progress
- **Languages:** Korean and English, selectable on the title screen

This is a **web build in active development**. Chiikawa, Hachiware, and Usagi are available initially; additional characters unlock through achievements. The web and GBA builds share a C gameplay core. **[GBA v0.5.5 downloads and guide](https://github.com/haveanair/chiikawa-volleyball/tree/main/gba)** include locked and all-unlocked development ROMs.

### How to play

Web address: https://haveanair.github.io/chiikawa-volleyball/

For online play, create a room, share its four-digit code with a friend, and start the match after they join.

| Action | Player 1 | Player 2 | Mobile |
|---|---|---|---|
| Move | A / D | Left / Right | Left-side ◀ / ▶ |
| Jump | W | Up | Left-side ▲ |
| Attack | F | Enter | Attack |
| Upward spike | W + F | Up + Enter | ▲ + Attack |

For local play on one phone, select Local Versus, confirm both characters, and use the full 1P/2P touch pads on the left/right. In online play, both players use the Player 1 controls on their own devices. Changed inputs are sent immediately; congested state snapshots are replaced by the latest state. Internet round-trip latency still applies.

Achievements are stored in the current browser. Export a backup before resetting them; reset requires a confirmation dialog. The title demos never modify achievement progress. Use the shareable [promo poster](docs/promo/chiikawa-volley-promo.png), [QR PNG](docs/promo/chiikawa-volley-qr.png), or [printable QR SVG](docs/promo/chiikawa-volley-qr.svg) to bring friends directly to the game.

For CPU play, open Local Versus, set Opponent to Computer, choose difficulty (1–5), court and both characters. The CPU controls Player 2; mobile uses the solo touch pad. Switch back to Friend for dual pads. Free versus matches do not change story achievements. Matchup-based encounters also play in local, CPU and online matches; online play waits until both players finish or skip their encounter. Both players should refresh to the latest version.

### Credits / 제작 및 원작

제작 / Created by: **파워덕질 2026**

캐릭터 원작 / Original characters: **나가노 · 치이카와 / Nagano · Chiikawa**

게임 기반 및 참고 / Game foundations and references: **하모 아요 배구 GBA / Hamo Ayo Volleyball GBA · 피카츄배구 / Pikachu Volleyball · 치이카와 포켓 / Chiikawa Pocket**

비영리 2차 창작 팬게임입니다. 공식 게임이 아니며, 캐릭터·이미지·음원의 권리는 각 권리자에게 있습니다.

This is an unofficial, non-commercial fan game. Characters, artwork, and audio belong to their respective rights holders.

하모 아요 코드의 MIT 고지는 [LICENSE-HAMO-MIT](docs/LICENSE-HAMO-MIT.txt)를 참고하세요. / See the linked file for the MIT notice covering the Hamo Ayo source code.

### Source layout

- `docs/`: Web game deployment files
- `shared/`: C gameplay core for the web build and planned GBA port
- `server/supabase/`: Dedicated four-digit room service, hosted on the existing Supabase project
