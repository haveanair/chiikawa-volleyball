# 치이카와 배구 · Chiikawa Volley

**작은 친구들의 큰 승부! 치이카와 친구들과 함께하는 비영리 2차 창작 배구 팬게임입니다.**

치이카와, 하치와레, 우사기를 비롯한 다양한 캐릭터를 골라 배구 대결을 즐겨 보세요. 하모 아요 배구 GBA와 피카츄배구의 경쾌한 게임성을 바탕으로, 캐릭터별 연출과 초필살기, 스토리 모드를 더했습니다.

- **스토리 모드:** 하치와레의 집에서 세이렌의 동굴까지 이어지는 5개 스테이지
- **다양한 캐릭터:** 주인공 친구들부터 파자마파티즈, 한잎이·두잎이, 곤충몬스터, 데카츠요, 세이렌까지
- **대전:** 같은 컴퓨터에서 즐기는 2인 대전과 숫자 4자리 방 번호로 연결하는 온라인 친구 대전
- **초필살기:** 공을 10번 튕겨 게이지를 채운 뒤 상단 스파이크를 맞히면 발동
- **모바일 조작:** 가로 화면에서 왼쪽 좌·우·점프 버튼, 오른쪽 공격 버튼 사용
- **한국어 / 영어:** 타이틀 화면에서 언어 변경

현재 개발 중인 **웹 테스트판**이며 모든 캐릭터를 선택할 수 있습니다. GBA 이식을 고려해 C 언어 경기 코어를 사용하며, GBA 버전은 별도 개발 대상입니다.

### 플레이 및 조작

웹 주소: https://haveanair.github.io/chiikawa-volleyball/

온라인 대전은 한 명이 방을 만들고, 친구가 같은 4자리 방 번호를 입력해 참가한 뒤 방장이 시작합니다.

| 조작 | 1P | 2P | 스마트폰 |
|---|---|---|---|
| 좌우 이동 | A / D | ← / → | 왼쪽 ◀ / ▶ |
| 점프 | W | ↑ | 왼쪽 ▲ |
| 공격 | F | K | 오른쪽 공격 |
| 상단 스파이크 | W + F | ↑ + K | ▲ + 공격 |

---

**A little match with a big heart! A non-commercial, fan-made volleyball game featuring the world of Chiikawa.**

Choose Chiikawa, Hachiware, Usagi, and more for lively volleyball matches. Inspired by Hamo Ayo Volleyball for GBA and Pikachu Volleyball, the game adds character animations, special shots, and a five-stage story mode.

- **Story mode:** Five courts, from Hachiware’s home to Siren’s cave
- **Character roster:** Familiar friends, Pajama Parties, Hitohā and Futabā, the insect monster, Dekatsuyo, Siren, and more
- **Versus play:** Local two-player matches and online friend matches using a four-digit room code
- **Special shots:** Fill the gauge with 10 ball hits, then land an upward spike to unleash a special move
- **Mobile controls:** Landscape play with movement and jump on the left, and one attack button on the right
- **Languages:** Korean and English, selectable on the title screen

This is a **web test build in active development**, with all characters available for testing. The game uses a shared C gameplay core with a future GBA port in mind. A playable GBA release is not included.

### How to play

Web address: https://haveanair.github.io/chiikawa-volleyball/

For online play, create a room, share its four-digit code with a friend, and start the match after they join.

| Action | Player 1 | Player 2 | Mobile |
|---|---|---|---|
| Move | A / D | Left / Right | Left-side ◀ / ▶ |
| Jump | W | Up | Left-side ▲ |
| Attack | F | K | Right-side Attack |
| Upward spike | W + F | Up + K | ▲ + Attack |

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
