# 치이카와 배구 GBA · Chiikawa Volleyball GBA

**v0.5.5 개발 테스트판 · 한국어 / English · 잠금판과 전체 해금판**

제작 **파워덕질 2026** · © 나가노 · 치이카와 · 비영리 2차 창작 팬게임

![한국어와 영어 타이틀](https://github.com/haveanair/chiikawa-volleyball/raw/main/gba/images/title-ko-en.png)

## 다운로드 / Downloads

**[전체 패키지 ZIP 받기](https://github.com/haveanair/chiikawa-volleyball/releases/download/gba-v0.5.5/chiikawa-volleyball-gba-v0.5.5.zip)** — 두 ROM, 실행 바로가기, 설명서, 실제 실행 화면과 검증 기록이 포함되어 있습니다.

| 버전 / Build | 내용 / Availability | 다운로드 / Download |
| --- | --- | --- |
| 잠금판 / Locked | 치이카와·하치와레·우사기로 시작, 도전과제로 추가 해금 / Start with the main trio; unlock the rest through achievements | [32 MiB ROM](https://github.com/haveanair/chiikawa-volleyball/releases/download/gba-v0.5.5/chiikawa-volleyball-v0.5.5-locked.gba) |
| 전체 해금판 / All unlocked | 14개 캐릭터 슬롯 모두 선택 / All 14 roster slots available | [32 MiB ROM](https://github.com/haveanair/chiikawa-volleyball/releases/download/gba-v0.5.5/chiikawa-volleyball-v0.5.5-unlocked.gba) |

[한국어 설명서 / Detailed guide](https://github.com/haveanair/chiikawa-volleyball/releases/download/gba-v0.5.5/README.ko.md) · [파일 해시 / SHA256 checksums](https://github.com/haveanair/chiikawa-volleyball/releases/download/gba-v0.5.5/SHA256SUMS.txt) · [웹 버전 플레이 / Play web version](https://haveanair.github.io/chiikawa-volleyball/)

**GitHub가 자동으로 제공하는 Source code ZIP은 실행용 ROM이 아닙니다. 위 패키지 또는 아래 Assets의 `.gba` 파일을 받으세요.**

## 플레이 방법

GBA 에뮬레이터에서 `.gba` 파일을 여세요. Windows용 ZIP의 실행 바로가기는 `C:\RetroArch-Win64`에 설치된 RetroArch와 mGBA 코어를 사용합니다. 다른 위치나 다른 운영체제에서는 에뮬레이터에서 ROM을 직접 여세요.

| 화면 / 동작 | 조작 |
| --- | --- |
| 타이틀 언어 선택 | L / R: 한국어 ↔ English, 설정 저장 |
| 캐릭터 선택 | 방향키 이동 · A/START 결정 · B 뒤로 |
| 승리 점수 | 캐릭터 선택에서 L/R: 10·15·20점 |
| 스토리 맵 / CPU 대전 배경 | 좌우: 스테이지 · L/R: 쉬움·보통·어려움 |
| 이동 / 점프 | 좌우 / 위 |
| 공격 / 상단 스파이크 | A / 위+A |
| 초필살기 | 공 10회 튕겨 MAX 후 상단 스파이크 |
| 일시정지 | START 계속·정지 · 정지 중 B 캐릭터 선택 |
| 도전과제 | L/R 또는 좌우로 페이지 이동 · B 복귀 |
| 진동 | SELECT 켜기 / 끄기 |

잠금판과 해금판은 파일명이 달라 일반적인 에뮬레이터에서 세이브가 각각 생성됩니다. 패키지에는 세이브가 포함되지 않습니다. **캐릭터 전체 해금과 스토리 맵 개방은 별개**이며 두 판 모두 스토리는 1스테이지부터 진행합니다.

## 이번 버전

- 한국어·영어 타이틀, 메뉴, 캐릭터 이름, 안내, 도전과제, 경기 결과와 컷인 문구. 타이틀 L/R로 변경하며 언어 설정은 저장됩니다.
- 스토리와 CPU 자유 대전의 난이도 3단계. 캐릭터 선택에서 승리 점수 10·15·20점 선택.
- v0.4의 부드러운 글꼴·점수 표현 복귀. 타이틀·선택 화면 전용 고밀도 원본 변환과 전용 팔레트, 18캐릭터 3줄 애니메이션 엔딩.
- 잠금 캐릭터는 목록과 미리보기에서 어두운 회색으로 표시하고, 해금하면 원래 색으로 복원.
- 무입력 시 타이틀 20초와 CPU 데모 20초를 번갈아 표시. 데모는 1~5스테이지 반복, 상호작용 대사 후 CPU 경기를 진행합니다. 경기 중에는 타이틀과 동일한 투명 로고를 중앙 최상위에 표시하고 로고 아래 데모 / DEMO 문구만 2초 표시·2초 숨김으로 점멸, 버튼 입력으로 타이틀 복귀. 데모 결과는 진행 기록에 합산하지 않습니다.
- 5개 스테이지, 캐릭터별 목소리 또는 전용 효과음, MAX 게이지·완료음·진동, 파란 공 잔상, 초필살기 컷인·불꽃·화면 떨림.
- 한잎이·두잎이는 한 슬롯에서 함께 등장하고 득점 후 역할을 교대합니다.

![GBA 타이틀 실제 실행](https://github.com/haveanair/chiikawa-volleyball/raw/main/gba/images/title-animation.gif)

![GBA 초필살기 실제 실행](https://github.com/haveanair/chiikawa-volleyball/raw/main/gba/images/super-sequence.gif)

![잠금 캐릭터 회색 표시](https://github.com/haveanair/chiikawa-volleyball/raw/main/gba/images/locked-roster.png)

![18캐릭터 엔딩 실제 실행](https://github.com/haveanair/chiikawa-volleyball/raw/main/gba/images/ending-animation.gif)

## v0.5.5 변경 사항 / Changes

- 일반 대사와 괄호 안 행동 설명을 서로 다른 줄에 표시합니다. 문장이 끝나면 다음 문장도 새 줄에서 시작합니다.
- 긴 대사는 3줄 단위의 화면을 넘겨 이어 읽을 수 있습니다. 한국어·영어의 페이지 수를 맞추면서 원문을 생략하거나 중복하지 않습니다.
- 웹 버전의 상호작용 대사를 GBA 스토리·대전·CPU 데모에 적용했습니다. 캐릭터는 위, 대사창은 아래에 배치하고 대사 중 로고와 DEMO 문구를 숨깁니다.
- 대사 페이지가 바뀌어도 같은 발화를 다시 재생하거나 끊지 않도록 했습니다. VBlank 오디오 처리와 화면 전송 순서를 조정해 대사 중 음악 끊김을 개선했습니다.
- 데모 경기에는 배경을 제거한 실제 타이틀 로고를 중앙 최상위에 배치하며, 로고 아래 DEMO 문구만 천천히 점멸합니다.
- 대사 원문 보존·줄바꿈·페이지 전환·음성·데모·언어·잠금 조건 등을 포함한 mGBA 검사 34개를 최종 통과했습니다. 실기 검증을 의미하지는 않습니다.

**Dialogue layout:** Spoken lines and parenthesized stage directions start on separate lines. New sentences start on new lines; longer dialogue continues across balanced bilingual pages without dropping or repeating the source text. Web encounters now appear in story, versus and attract demos. Characters appear above the dialogue panel, and the logo is hidden during dialogue. Audio/video scheduling and voice continuation have also been improved. During CPU rallies, the transparent title logo stays centered above the game; only the DEMO caption below it blinks slowly.

![대사 줄바꿈 실제 실행](https://github.com/haveanair/chiikawa-volleyball/raw/main/gba/images/dialogue-linebreak.png)

## 데모의 실제 타이틀 로고

![한국어 실제 타이틀 로고 데모](https://github.com/haveanair/chiikawa-volleyball/raw/main/gba/images/demo-ko.png)

![English title-logo demo](https://github.com/haveanair/chiikawa-volleyball/raw/main/gba/images/demo-en.png)

## 잠금판 해금 조건

| 캐릭터 | 조건 |
| --- | --- |
| 곤충몬스터 | 1스테이지 승리 |
| 모몽가 | 1스테이지 7점 이상 차 승리 |
| 데카츠요 | 2스테이지 승리 |
| 시사 | 2스테이지 7점 이상 차 승리 |
| 랏코 | 2스테이지 10점 이상 차 승리 |
| 파자마 파티즈 | 3스테이지 7점 이상 차 승리 |
| 한잎이·두잎이 | 4스테이지 7점 이상 차 승리 |
| 쿠리만쥬 | 상단 스파이크 50회 |
| 카니 | 초필살기 10회 |
| 포셰트 갑옷씨 | 스토리 경기 10회 승리 |
| 세이렌 | 5스테이지 7점 이상 차 승리 |

CPU 자유 대전은 스토리 해금 실적에 합산하지 않습니다.

## 테스트 범위와 남은 작업

현재는 **완성판이 아닌 개발 테스트판**입니다. mGBA에서 14종 경기 실행, 두 판의 언어 전환·저장, 잠금 조건과 전체 선택, 난이도, 음성·음악, 배경 재진입, 점수·게이지·필살기 연출을 검사했습니다. 일부 검사는 격리된 RAM 상태로 해금 조건·득점·공 접촉을 재현했으며 전체 스토리를 수동 완주했다는 의미는 아닙니다.

실제 GBA 두 대의 케이블 통신, 플래시카트 진동 및 실기 오디오는 미검증입니다. 18인 3줄 애니메이션 엔딩은 적용했으며, **최종 스크롤 스탭롤은 후속 작업**입니다. GBA의 240×160 해상도에 따른 세부 표현 한계도 있습니다. ZIP의 `verification` 폴더에서 해당 ROM 해시가 적힌 검증 기록을 확인할 수 있습니다.

## English

**Chiikawa Volleyball GBA v0.5.5 is a non-commercial fan-game development build.** Download the package ZIP for both ROMs and documentation, or choose a standalone 32 MiB `.gba` file above.

- **Locked:** Start with Chiikawa, Hachiware and Usagi; unlock additional characters through achievements.
- **All unlocked:** Select all 14 roster slots immediately. Story stages still open in order. The two ROM filenames keep saves separate in typical emulators.
- **Attract mode:** After 20 seconds of title-screen inactivity, a 20-second CPU demo begins. Title and demo alternate, cycling through stages 1–5. Press a button to return to the title. Demo results do not change saved progress. Character encounters play before the CPU rally. The transparent title logo stays centered above the game during the rally, with the DEMO caption below it blinking two seconds on and two seconds off. Both are hidden during dialogue.
- **Presentation:** Locked characters appear in dark grayscale; the v0.4 soft font style returns, alongside dedicated UI character art and an animated 18-character ending.
- **Language:** Press L/R on the title screen to switch Korean / English. The setting is saved. Original character voices and music remain unchanged.
- **Controls:** Left/right move, up jumps, A attacks, up+A performs an upper spike. After 10 ball hits fill MAX, an upper spike triggers a super shot. START pauses/continues; B while paused returns to character selection.
- **Settings:** L/R changes the winning score (10/15/20) on character selection, or difficulty (Easy/Normal/Hard) on the story map / CPU stage screen.
- **Emulator:** Open the `.gba` in a GBA emulator. Bundled Windows shortcuts expect RetroArch with mGBA at `C:\RetroArch-Win64`; otherwise open the ROM manually.

The build has been tested in mGBA, including both language modes and character-availability variants. Physical two-console link play, cartridge rumble and real-hardware audio are unverified. The animated 18-character ending is included; final scrolling credits remain unfinished. GitHub's automatic **Source code** archives are not playable ROM downloads.

## 제작 및 원작 / Credits

제작 / Created by **파워덕질 2026 · PowerDeok 2026**

캐릭터 원작 / Original characters: **나가노 · 치이카와 / Nagano · Chiikawa**

게임 기반 및 참고 / Game foundations and references: **하모 아요 배구 GBA / Hamo Ayo Volleyball GBA · 피카츄배구 / Pikachu Volleyball · 치이카와 포켓 / Chiikawa Pocket**

공식 게임이 아닌 비영리 2차 창작 팬게임입니다. 캐릭터·이미지·음원의 권리는 각 권리자에게 있습니다. / This is an unofficial, non-commercial fan game. Characters, artwork and audio belong to their respective rights holders.

하모 아요 코드의 MIT 고지 / Hamo Ayo code MIT notice: [LICENSE-HAMO-MIT](https://github.com/haveanair/chiikawa-volleyball/blob/main/docs/LICENSE-HAMO-MIT.txt).
