/**
 * CHIẾN DỊCH: XÂY DỰNG TÌNH BẠN ĐẸP - NÓI KHÔNG VỚI BẠO LỰC HỌC ĐƯỜNG
 * Trường THPT Mường Lầm & Đoàn xã Mường Lầm (Sơn La) - Năm học 2026 - 2027
 * 
 * Module: script.js
 * Chức năng:
 *  - Quản lý danh sách tập Radio / Podcast Tình bạn Mường Lầm
 *  - Bộ phát âm thanh thông minh đa tầng (Multi-tier Audio & TTS Engine):
 *      + Tier 1: Web Speech API (Giọng tiếng Việt tự nhiên: HoaiMy, Google tiếng Việt, NamMinh)
 *      + Tier 2: Google TTS Audio Stream chất lượng cao (No-referrer fallback)
 *      + Tier 3: File MP3 thu âm thực tế (khi có file)
 *  - Bộ xử lý ngắt nghỉ tự nhiên, phiên âm tiếng Việt và điều chỉnh tốc độ (1.13x) & cao độ (1.04)
 *  - Bảng vàng cam kết điện tử (Live Commitment Counter & Ticker)
 *  - Hòm thư "Điều em muốn nói" ẩn danh bảo mật
 *  - Modal xem toàn văn kịch bản Audio Radio
 *  - Bắn pháo hoa vinh danh (Canvas Confetti)
 *  - Menu điều hướng Responsive cho thiết bị di động
 */

// --- 1. DANH SÁCH CÁC TẬP PODCAST VÀ KỊCH BẢN CHI TIẾT ---
const podcastEpisodes = [
  {
    title: "Chung Một Nhịp Cầu Bản Xa",
    sub: "Tập 1 • Bỡ ngỡ lớp 10 & Rào cản hòa nhập",
    desc: "Câu chuyện về Mẩy - nữ sinh người Thái mang xôi nếp nương ra trường huyện và tấm lòng ấm áp của các anh chị khóa trên.",
    duration: "03:45",
    durationSec: 225,
    audioUrl: "", // Chừa sẵn đường dẫn MP3 thật (ví dụ: './assets/audio/tap-1.mp3')
    speechLines: [
      { speaker: "🎙️ MC Dẫn Chuyện", text: "Chào mừng các bạn đoàn viên, học sinh đến với Radio Tình Bạn Mường Lầm số 1! Chủ đề hôm nay: Chung Một Nhịp Cầu Bản Xa." },
      { speaker: "🎙️ MC Dẫn Chuyện", text: "Tiếng trống khai trường đã điểm. Đối với các bạn học sinh lớp 10 rời bản xa về khu bán trú, những ngày đầu tiên có luôn tràn ngập màu hồng? Hãy cùng lắng nghe tâm sự của Mẩy." },
      { speaker: "🌸 Bạn Mẩy (Lớp 10)", text: "Trời ơi, hết giờ học rồi... Lớp đông bạn quá, bạn nào quần áo cũng đẹp, nói chuyện rôm rả ghê. Mình ở bản Pá Sáng ra đây, nói tiếng Kinh chưa sõi, chẳng dám bắt chuyện với ai cả..." },
      { speaker: "🌸 Bạn Mẩy (Lớp 10)", text: "Mẹ dậy từ 4 giờ sáng thổi cho mình nắm xôi nếp nương chấm mắc khén này. Ngon lắm, nhưng ăn ở đây các bạn có cười không nhỉ..." },
      { speaker: "👤 Bạn Học Sinh", text: "Ôi đứa nào ăn cái gì mà mùi nồng thế? Mùi mắc khén à? Đi học cấp ba rồi mà vẫn mang cả bọc lá chuối như đi làm nương thế kia kìa!" },
      { speaker: "🌸 Bạn Mẩy (Lớp 10)", text: "Mình... mình đâu có làm gì sai đâu... Sao các bạn lại bảo mình quê một cục... Hay là mình xin bố mẹ về bản, không đi học trường huyện nữa..." },
      { speaker: "🌼 Bạn Lan (Lớp 10)", text: "Mẩy ơi! Sao cậu lại ngồi thu lu ở góc cầu thang thế này? Cả lớp đang rủ nhau xuống nhà ăn bán trú mà không thấy cậu đâu!" },
      { speaker: "🌼 Bạn Lan (Lớp 10)", text: "Ủa, mắt cậu đỏ hoe thế kia? Ai trêu cậu à? Nói cho tớ biết đi, tớ bảo thầy Bí thư Đoàn trường giải quyết liền!" },
      { speaker: "⭐ Anh Tuấn (Lớp 11)", text: "Mùi gì mà thơm phức từ đầu hành lang đến đây thế này nhỉ? Cho anh Tuấn lớp 11 xin một miếng được không?" },
      { speaker: "⭐ Anh Tuấn (Lớp 11)", text: "Trời ơi, xôi nếp nương đồ bằng chõ gỗ, chấm chẩm chéo mẹ giã tay đúng không Mẩy? Ở trường Mường Lầm này, hơn nửa số bạn là con em các bản xa về đây ở bán trú đấy em ạ!" },
      { speaker: "⭐ Anh Tuấn (Lớp 11)", text: "Trường mình có truyền thống: Nhà sàn chung một mái, bán trú ấm một lòng. Mỗi món ăn quê, mỗi nét văn hóa của bản làng mình đều là niềm tự hào của học trò Mường Lầm!" },
      { speaker: "🌼 Bạn Lan (Lớp 10)", text: "Đúng rồi đó Mẩy ơi! Cho tớ ăn chung với nào! Tớ mê tít món xôi nếp nương quê mình luôn! Từ mai, tớ sẽ đưa cậu làm quen với các chị khóa trên, chiều chiều mình cùng ra sân tập bóng chuyền hơi nhé!" },
      { speaker: "🌸 Bạn Mẩy (Lớp 10)", text: "Cảm ơn Lan, cảm ơn anh Tuấn nhiều lắm... Lan ăn miếng to này đi! Anh Tuấn ăn cùng chúng em nhé!" },
      { speaker: "🎙️ MC Dẫn Chuyện", text: "Các bạn học sinh yêu quý! Một lời trêu chọc vô tình có thể làm bạn mình co mình lại. Nhưng một bàn tay chìa ra sẻ chia có thể thắp sáng cả một tương lai." },
      { speaker: "🎙️ MC Dẫn Chuyện", text: "Hãy luôn nhớ: Mường Lầm Chung Mái Trường Xanh – Nắm Tay Gắn Kết, Chẳng Đành Tổn Thương!" }
    ],
    scriptSummary: `
      <div class="p-4 bg-blue-50 rounded-2xl border border-blue-200 mb-4">
        <h5 class="font-bold text-doan mb-1 flex items-center gap-2">
          <i class="fa-solid fa-bullhorn"></i> Thông điệp cốt lõi:
        </h5>
        <p class="text-xs text-slate-700">
          Sự khác biệt về trang phục, món ăn hay chất giọng bản làng không phải là rào cản, mà là sắc màu đáng tự hào tạo nên bản sắc học trò Mường Lầm!
        </p>
      </div>

      <h5 class="font-black text-slate-900 border-b pb-1">Phân vai nhân vật:</h5>
      <ul class="list-disc pl-5 text-xs space-y-1">
        <li><strong>MC Dẫn chuyện:</strong> Giọng ấm áp, truyền cảm hứng.</li>
        <li><strong>Mẩy (Lớp 10):</strong> Nữ sinh người Thái bản Pá Sáng, nhút nhát, sợ bị chê cười.</li>
        <li><strong>Lan (Lớp 10):</strong> Bạn cùng lớp, sống ở phố huyện nhưng rất cởi mở, tốt bụng.</li>
        <li><strong>Tuấn (Lớp 11):</strong> Cán bộ Đoàn trường, từng trải qua giai đoạn bán trú lớp 10.</li>
      </ul>

      <h5 class="font-black text-slate-900 border-b pb-1 pt-2">Trích đoạn nổi bật:</h5>
      <div class="space-y-2 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
        <p><strong>Mẩy (nghẹn ngào):</strong> "Mẹ dậy từ 4h sáng thổi cho mình nắm xôi nếp nương chấm mắc khén... Thế mà các bạn bảo mùi nồng, nhìn quê một cục... Mình muốn về bản thôi..."</p>
        <p><strong>Tuấn (cười hiền):</strong> "Mùi thơm nếp nương đồ chõ gỗ chứ quê gì em! Trường THPT Mường Lầm mình có truyền thống: 'Nhà sàn chung một mái, bán trú ấm một lòng'. Mỗi món quà quê các em mang về đây đều là niềm tự hào của bản làng!"</p>
        <p><strong>Lan (chìa tay):</strong> "Đúng rồi đó Mẩy ơi! Cho tớ ăn chung với nào! Chiều nay mình cùng sang sân bóng chuyền tập nhé!"</p>
      </div>
    `
  },
  {
    title: "Bão Giông Sau Màn Hình Nhỏ",
    sub: "Tập 2 • Bạo lực mạng & Lời bình luận vô tình",
    desc: "Vàng - nam sinh người H'Mông bị chụp lén áo chàm sờn chỉ đăng lên TikTok giễu cợt và bài học đắt giá về sự tử tế trên không gian mạng.",
    duration: "03:15",
    durationSec: 195,
    audioUrl: "", // Chừa sẵn đường dẫn MP3 thật
    speechLines: [
      { speaker: "🎙️ MC Dẫn Chuyện", text: "Chào mừng các bạn đến với Tập 2 của Radio Tình Bạn Mường Lầm mang tên: Bão Giông Sau Màn Hình Nhỏ." },
      { speaker: "🎙️ MC Dẫn Chuyện", text: "Mạng xã hội giúp chúng ta kết nối, nhưng những lời bình luận vô tình hay trò đùa cợt nhả có thể biến thành cơn ác mộng đối với bạn bè quanh mình." },
      { speaker: "🎨 Bạn Vàng (Lớp 11)", text: "Mình là Vàng, học sinh người Mông ở khu bán trú. Hôm tập văn nghệ, chiếc áo chàm truyền thống của mình bị sờn một chút ở nách áo vì mặc đã nhiều năm..." },
      { speaker: "📱 Nhóm Bạn Quay Lén", text: "Nhìn kìa nhìn kìa, hotboy bản Mông mặc áo rách đi tìm người yêu này! Quay clip đăng lên TikTok câu view ngay đi tụi mày ơi!" },
      { speaker: "🎨 Bạn Vàng (Lớp 11)", text: "Chỉ sau một đêm, đoạn clip đạt hơn mười ngàn lượt xem. Hàng trăm bình luận giễu cợt, xúc phạm... Mình xấu hổ không dám bước chân ra khỏi phòng bán trú, mình muốn bỏ học..." },
      { speaker: "👩‍🏫 Cô Giáo Bí Thư Đoàn", text: "Vàng ơi, em đừng khóc nữa! Việc dùng hình ảnh của bạn bè để bêu rếu, chế giễu trên không gian mạng là hành vi vi phạm đạo đức học sinh nghiêm trọng và vi phạm Luật An ninh mạng." },
      { speaker: "👮 Cán Bộ Công An Xã", text: "Hành vi xúc phạm danh dự người khác trên mạng xã hội sẽ bị xử phạt theo Nghị định 144 và quy định của nhà trường. Các em tuyệt đối không được tham gia hùa theo bạo lực mạng!" },
      { speaker: "📱 Bạn Đăng Clip (Hối Hận)", text: "Vàng ơi, mình vô cùng xin lỗi cậu! Mình chỉ nghĩ quay clip cho vui, không ngờ lại làm cậu tổn thương và hoảng sợ đến thế. Mình đã xóa clip và sẽ công khai xin lỗi cậu trên trang cá nhân." },
      { speaker: "🎙️ MC Dẫn Chuyện", text: "Các bạn học sinh hãy nhớ: Trước khi bấm like hay bình luận điều gì trên Facebook, TikTok, hãy đặt mình vào vị trí của người khác. Hãy là một học sinh văn minh cả ngoài đời lẫn trên mạng xã hội!" }
    ],
    scriptSummary: `
      <div class="p-4 bg-amber-50 rounded-2xl border border-amber-200 mb-4">
        <h5 class="font-bold text-amber-800 mb-1 flex items-center gap-2">
          <i class="fa-solid fa-triangle-exclamation"></i> Thông điệp cốt lõi:
        </h5>
        <p class="text-xs text-slate-700">
          Một cái bấm like hay comment cợt nhả có thể là nhát dao cứa nát sự tự tin của bạn bè. Đừng làm "anh hùng bàn phím" gieo rắc tổn thương!
        </p>
      </div>

      <h5 class="font-black text-slate-900 border-b pb-1">Phân vai nhân vật:</h5>
      <ul class="list-disc pl-5 text-xs space-y-1">
        <li><strong>Vàng (Lớp 11):</strong> Nam sinh người Mông, có biệt tài thổi khèn và vẽ tranh.</li>
        <li><strong>Nhóm quay clip TikTok:</strong> Học sinh vô tư quay lén mà không lường trước hậu quả.</li>
        <li><strong>Cô giáo Bí thư Đoàn trường & Cán bộ Công an xã:</strong> Can thiệp giải thích luật an ninh mạng.</li>
      </ul>

      <h5 class="font-black text-slate-900 border-b pb-1 pt-2">Trích đoạn nổi bật:</h5>
      <div class="space-y-2 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
        <p><strong>Vàng (khóc đóng cửa phòng):</strong> "Clip lên cả chục ngàn view, ai cũng vào bình luận cười cợt chiếc áo chàm của em... Giờ em không dám vác mặt lên lớp nữa..."</p>
        <p><strong>Cán bộ Công an xã Mường Lầm:</strong> "Xúc phạm danh dự, nhân phẩm người khác trên không gian mạng không chỉ vi phạm đạo đức học đường mà còn bị xử phạt theo Nghị định 144 và Luật An ninh mạng."</p>
        <p><strong>Bạn học sinh đăng clip (hối hận):</strong> "Mình xin lỗi Vàng! Mình chỉ nghĩ quay cho vui, không ngờ lại làm bạn đau lòng đến thế..."</p>
      </div>
    `
  },
  {
    title: "Dũng Cảm Lên Tiếng – Mình Ở Bên Bạn!",
    sub: "Tập 3 • Ứng xử văn minh khi bạn bị bắt nạt",
    desc: "Dũng bị ép giặt đồ hộ và nộp tiền ăn sáng; Phong dũng cảm gửi thư vào 'Hòm thư Điều em muốn nói' để giải cứu bạn.",
    duration: "03:30",
    durationSec: 210,
    audioUrl: "", // Chừa sẵn đường dẫn MP3 thật
    speechLines: [
      { speaker: "🎙️ MC Dẫn Chuyện", text: "Chào mừng các bạn đến với Tập 3 của Radio Tình Bạn Mường Lầm: Dũng Cảm Lên Tiếng – Mình Ở Bên Bạn!" },
      { speaker: "🎙️ MC Dẫn Chuyện", text: "Khi chứng kiến một người bạn yếu thế bị bắt nạt, bạn sẽ chọn im lặng cho yên thân, hay dũng cảm lên tiếng tìm sự trợ giúp?" },
      { speaker: "💧 Bạn Dũng (Lớp 10)", text: "Mình là Dũng, người nhỏ thó nhất khu bán trú. Tuần nào mấy bạn khóa trên cũng ép mình phải giặt chậu quần áo to đùng ở khu giếng nước và lấy tiền ăn sáng của mình... Mình sợ lắm..." },
      { speaker: "🤝 Bạn Phong (Cùng Phòng)", text: "Mình là Phong, ở chung phòng với Dũng. Nhìn Dũng nhịn ăn sáng, mặt mày hốc hác, mình dằn vặt vô cùng. Nếu mình báo thầy cô, lỡ bị chúng nó trả thù thì sao? Nhưng nếu mình im lặng, mình có xứng đáng là bạn cùng phòng không?" },
      { speaker: "🤝 Bạn Phong (Cùng Phòng)", text: "Không thể để bạo lực tiếp diễn! Mình nhớ đến Hòm thư Điều Em Muốn Nói của Đoàn trường. Mình đã bí mật viết một bức thư kể lại sự việc và bỏ vào hòm thư ở nhà ăn bán trú." },
      { speaker: "👨‍🏫 Thầy Tổng Phụ Trách", text: "Cảm ơn em Phong đã vô cùng dũng cảm lên tiếng bảo vệ bạn mình. Danh tính của các em được Đoàn trường bảo mật tuyệt đối 100%!" },
      { speaker: "👨‍🏫 Thầy Tổng Phụ Trách", text: "Đoàn trường cùng Công an xã đã mời gia đình và các học sinh cá biệt lên làm việc, xử lý kỷ luật và ký cam kết không tái phạm. Dũng đã an toàn và vui vẻ trở lại." },
      { speaker: "🎙️ MC Dẫn Chuyện", text: "Im lặng trước cái xấu là tiếp tay cho bạo lực. Lên tiếng bảo vệ bạn bè bằng cách báo cho thầy cô, Đoàn trường chính là hành động dũng cảm và văn minh nhất của học trò Mường Lầm!" }
    ],
    scriptSummary: `
      <div class="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 mb-4">
        <h5 class="font-bold text-emerald-800 mb-1 flex items-center gap-2">
          <i class="fa-solid fa-shield-halved"></i> Thông điệp cốt lõi:
        </h5>
        <p class="text-xs text-slate-700">
          Im lặng trước cái xấu là tiếp tay cho bạo lực. Lên tiếng bảo vệ bạn mình bằng cách tìm đến Đoàn trường là hành động dũng cảm nhất!
        </p>
      </div>

      <h5 class="font-black text-slate-900 border-b pb-1">Phân vai nhân vật:</h5>
      <ul class="list-disc pl-5 text-xs space-y-1">
        <li><strong>Dũng (Lớp 10 bán trú):</strong> Học sinh nhỏ con, hiền lành, bị bắt nạt ở khu giếng nước.</li>
        <li><strong>Phong (Lớp 10 cùng phòng):</strong> Người chứng kiến, dằn vặt nội tâm giữa sợ hãi và lương tâm.</li>
        <li><strong>Thầy Tổng phụ trách Đoàn:</strong> Lắng nghe bí mật và xử lý nhân văn, nghiêm khắc.</li>
      </ul>

      <h5 class="font-black text-slate-900 border-b pb-1 pt-2">Trích đoạn nổi bật:</h5>
      <div class="space-y-2 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
        <p><strong>Phong (nội tâm):</strong> "Nếu mình báo thầy, lỡ bị chúng nó trả thù thì sao? Nhưng nếu mình im lặng, nhìn Dũng nhịn ăn sáng, mặt mày hốc hác thế kia... mình có xứng đáng là bạn cùng phòng không?"</p>
        <p><strong>Thầy Tổng phụ trách:</strong> "Cảm ơn em Phong đã dũng cảm bỏ bức thư vào hòm thư ẩn danh. Thầy cam kết danh tính của hai em được giữ kín 100%. Mái trường Mường Lầm này không có chỗ cho hành vi bắt nạt!"</p>
      </div>
    `
  }
];

// --- 2. BỘ ĐIỀU KHIỂN ÂM THANH & GIỌNG ĐỌC ĐA TẦNG ---
let currentTrackIndex = 0;
let isPlaying = false;
let currentLineIndex = 0;
let currentChunkIndex = 0;
let currentLineChunks = [];
let currentVolume = 1.0;
let currentSpeed = 1.13; // Tốc độ tối ưu (1.13x: đọc nhanh gọn, mượt mà, cuốn hút chuẩn phát thanh)
let currentPitch = 1.04; // Cao độ tự nhiên (1.04: ấm áp, thanh thoát, không robotic)
let isMuted = false;
let activeEngine = 'stream'; // 'stream', 'speech', hoặc 'mp3'
let vietnameseVoice = null;
let voiceScanAttempts = 0;
let speechTimer = null;
let elapsedSeconds = 0;
let nextLineTimeout = null;
let hasFallenBackThisLine = false;

// DOM References
const realAudio = document.getElementById('realAudioElement');
const mainPlayBtn = document.getElementById('mainPlayBtn');
const playIcon = document.getElementById('playIcon');
const centerPlayIcon = document.getElementById('centerPlayIcon');
const prevTrackBtn = document.getElementById('prevTrackBtn');
const nextTrackBtn = document.getElementById('nextTrackBtn');
const playerBadge = document.getElementById('playerBadge');
const playerEpisodeSub = document.getElementById('playerEpisodeSub');
const playerEpisodeTitle = document.getElementById('playerEpisodeTitle');
const currentTrackTitle = document.getElementById('currentTrackTitle');
const currentTrackDesc = document.getElementById('currentTrackDesc');
const currentTimeEl = document.getElementById('currentTime');
const totalDurationEl = document.getElementById('totalDuration');
const progressBar = document.getElementById('progressBar');
const waveContainer = document.getElementById('waveContainer');
const playlistCards = document.querySelectorAll('.playlist-card');
const audioSourceBadge = document.getElementById('audioSourceBadge');
const engineSelector = document.getElementById('engineSelector');
const speedSelector = document.getElementById('speedSelector');
const volumeSlider = document.getElementById('volumeSlider');
const muteBtn = document.getElementById('muteBtn');
const volumeIcon = document.getElementById('volumeIcon');

// DOM Phụ đề thời gian thực
const subtitleSpeaker = document.getElementById('subtitleSpeaker');
const subtitleText = document.getElementById('subtitleText');
const subtitleStatus = document.getElementById('subtitleStatus');
const subtitleSpeakerIcon = document.getElementById('subtitleSpeakerIcon');

// Khởi tạo thuộc tính cho thẻ Audio
if (realAudio) {
  realAudio.volume = currentVolume;
  realAudio.muted = false;
  realAudio.playbackRate = currentSpeed;
  realAudio.addEventListener('play', () => {
    realAudio.playbackRate = currentSpeed;
  });
}

// Helper: Xử lý văn bản chuẩn phát thanh viên (Ngắt nghỉ tự nhiên & phiên âm số)
function prepareSpeechText(rawText) {
  if (!rawText) return "";
  let text = rawText;

  // 1. Phiên âm các con số, tên viết tắt, niên khóa để giọng đọc phát âm chuẩn tiếng Việt
  text = text.replace(/\bK10\b/gi, "khối mười");
  text = text.replace(/\bK11\b/gi, "khối mười một");
  text = text.replace(/\bK12\b/gi, "khối mười hai");
  text = text.replace(/\b10A1\b/gi, "mười A một");
  text = text.replace(/\b10A2\b/gi, "mười A hai");
  text = text.replace(/\b11A1\b/gi, "mười một A một");
  text = text.replace(/\b12A1\b/gi, "mười hai A một");
  text = text.replace(/\b10\b/g, "mười");
  text = text.replace(/\b11\b/g, "mười một");
  text = text.replace(/\b12\b/g, "mười hai");
  text = text.replace(/\b4 giờ\b/gi, "bốn giờ");
  text = text.replace(/\b4h\b/gi, "bốn giờ");
  text = text.replace(/\b144\b/g, "một trăm bốn mươi bốn");
  text = text.replace(/2026\s*[-–]\s*2027/g, "hai nghìn không trăm hai mươi sáu, hai nghìn không trăm hai mươi bảy");
  text = text.replace(/\bTikTok\b/gi, "Tóp Tóp");
  text = text.replace(/\bFacebook\b/gi, "Phây-s-búc");

  // 2. Chuyển dấu ba chấm (...) thành dấu phẩy nhẹ để giọng đọc lấy hơi tự nhiên
  text = text.replace(/\.{3,}/g, ", ");
  text = text.replace(/…/g, ", ");

  // 3. Chuẩn hóa khoảng cách dấu câu cho ngữ điệu lên xuống tự nhiên
  text = text.replace(/\s*([,;:.!?])\s*/g, "$1 ");
  text = text.replace(/\s+/g, " ").trim();

  return text;
}

// Helper: Tách câu dài thành các vế câu ngắn tự nhiên (<120 ký tự) theo dấu chấm, phẩy, hỏi, than
function splitIntoNaturalClauses(text, maxLength = 120) {
  if (!text) return [];
  const rawParts = text.split(/(?<=[.!?])\s+|(?<=[,;])\s+/);
  const clauses = [];
  let buffer = "";

  for (let part of rawParts) {
    part = part.trim();
    if (!part) continue;
    if ((buffer + " " + part).trim().length <= maxLength) {
      buffer = buffer ? (buffer + " " + part) : part;
    } else {
      if (buffer) clauses.push(buffer);
      if (part.length > maxLength) {
        const words = part.split(' ');
        let wordBuf = "";
        for (let w of words) {
          if ((wordBuf + " " + w).trim().length <= maxLength) {
            wordBuf = wordBuf ? (wordBuf + " " + w) : w;
          } else {
            if (wordBuf) clauses.push(wordBuf);
            wordBuf = w;
          }
        }
        buffer = wordBuf || "";
      } else {
        buffer = part;
      }
    }
  }
  if (buffer) clauses.push(buffer);
  return clauses.length > 0 ? clauses : [text];
}

// Lựa chọn giọng đọc tiếng Việt truyền cảm nhất có trên thiết bị người dùng
function pickBestVietnameseVoice(voices) {
  if (!voices || voices.length === 0) return null;
  const criteria = [
    v => /hoaimy.*natural|hoaimy.*online/i.test(v.name),      // Microsoft HoaiMy Online (Edge/Windows 11)
    v => /google.*ti[eế]ng.*vi[eệ]t/i.test(v.name),           // Google tiếng Việt (Chrome)
    v => /namminh.*natural|namminh.*online/i.test(v.name),    // Microsoft NamMinh Online
    v => /hoaimy/i.test(v.name),
    v => /namminh/i.test(v.name),
    v => (v.lang === 'vi-VN' || v.lang === 'vi_VN') && /natural|online|neural/i.test(v.name),
    v => v.lang === 'vi-VN' || v.lang === 'vi_VN',
    v => v.lang && v.lang.toLowerCase().startsWith('vi'),
    v => /vietnam|vietnamese|tieng viet/i.test(v.name)
  ];

  for (let test of criteria) {
    const match = voices.find(test);
    if (match) return match;
  }
  return null;
}

// Bộ quét giọng đọc bất đồng bộ (Polling + Event onvoiceschanged)
function initVoiceScanner() {
  if (!('speechSynthesis' in window)) return;

  const scan = () => {
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      const found = pickBestVietnameseVoice(voices);
      if (found) {
        vietnameseVoice = found;
        console.log("🎙️ [Radio Mường Lầm] Đã nhận diện giọng tiếng Việt:", found.name, `(${found.lang})`);
        updateAudioModeBadge();
      }
    }
  };

  scan();
  window.speechSynthesis.onvoiceschanged = () => {
    scan();
  };

  const timer = setInterval(() => {
    voiceScanAttempts++;
    scan();
    if (vietnameseVoice || voiceScanAttempts > 20) {
      clearInterval(timer);
    }
  }, 150);
}

initVoiceScanner();

// Xác định phương thức phát tối ưu
function determinePlaybackMode() {
  const track = podcastEpisodes[currentTrackIndex];
  const selectedSetting = engineSelector ? engineSelector.value : 'auto';

  if (selectedSetting === 'mp3' || (track.audioUrl && track.audioUrl.trim() !== "")) {
    return 'mp3';
  }
  if (selectedSetting === 'speech') {
    return 'speech';
  }
  if (selectedSetting === 'stream') {
    return 'stream';
  }

  // Chế độ tự động 'auto':
  if (track.audioUrl && track.audioUrl.trim() !== "") return 'mp3';
  if (vietnameseVoice) return 'speech'; // Ưu tiên Web Speech nếu có sẵn giọng tiếng Việt chất lượng cao
  return 'stream'; // Fallback sang Google TTS Stream nếu máy tính chưa cài giọng tiếng Việt
}

function updateAudioModeBadge() {
  if (!audioSourceBadge) return;
  const mode = determinePlaybackMode();
  activeEngine = mode;

  if (mode === 'mp3') {
    audioSourceBadge.innerHTML = `<i class="fa-solid fa-file-audio text-xs text-emerald-400"></i> Bản thu âm thật (.MP3)`;
    audioSourceBadge.className = "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30";
  } else if (mode === 'stream') {
    audioSourceBadge.innerHTML = `<i class="fa-solid fa-cloud-bolt text-xs text-amber-400"></i> Giọng Tiếng Việt Chuẩn (TTS Stream)`;
    audioSourceBadge.className = "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30";
  } else {
    const voiceName = vietnameseVoice ? vietnameseVoice.name.split(' ')[0] : 'Web Speech';
    audioSourceBadge.innerHTML = `<i class="fa-solid fa-robot text-xs text-blue-400"></i> Giọng Máy Trình Duyệt (${voiceName})`;
    audioSourceBadge.className = "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30";
  }
}

function loadTrack(index) {
  stopAllAudio();

  currentTrackIndex = index;
  currentLineIndex = 0;
  currentChunkIndex = 0;
  currentLineChunks = [];
  elapsedSeconds = 0;
  const track = podcastEpisodes[index];

  if (playerBadge) playerBadge.textContent = `Tập ${index + 1} • Kịch nói`;
  if (playerEpisodeTitle) playerEpisodeTitle.textContent = track.title;
  if (currentTrackTitle) currentTrackTitle.textContent = `Tập ${index + 1}: ${track.title}`;
  if (currentTrackDesc) currentTrackDesc.textContent = track.desc;
  if (totalDurationEl) totalDurationEl.textContent = track.duration;
  if (currentTimeEl) currentTimeEl.textContent = "00:00";
  if (progressBar) progressBar.style.width = '0%';

  updateAudioModeBadge();

  // Reset Khung phụ đề
  if (subtitleSpeaker) subtitleSpeaker.textContent = "🎙️ Lời Dẫn Phát Thanh Viên";
  if (subtitleText) subtitleText.textContent = "Bấm nút Play để bắt đầu nghe phát thanh Radio Tình Bạn Mường Lầm...";
  if (subtitleStatus) subtitleStatus.textContent = "Sẵn sàng phát";
  if (subtitleSpeakerIcon) subtitleSpeakerIcon.className = "fa-solid fa-volume-high text-amber-400";

  // Nếu có file MP3
  if (activeEngine === 'mp3' && track.audioUrl && realAudio) {
    realAudio.src = track.audioUrl;
  }

  // Cập nhật trạng thái Active trên danh sách phát
  playlistCards.forEach((card, idx) => {
    const iconBox = card.querySelector('.w-10');
    if (idx === index) {
      card.classList.add('border-doan', 'bg-slate-800');
      card.classList.remove('border-transparent', 'bg-slate-800/60');
      if (iconBox) {
        iconBox.classList.add('bg-doan', 'text-white');
        iconBox.classList.remove('bg-slate-700', 'text-slate-300');
      }
    } else {
      card.classList.remove('border-doan', 'bg-slate-800');
      card.classList.add('border-transparent', 'bg-slate-800/60');
      if (iconBox) {
        iconBox.classList.remove('bg-doan', 'text-white');
        iconBox.classList.add('bg-slate-700', 'text-slate-300');
      }
    }
  });
}

function togglePlay() {
  if (isPlaying) {
    pauseAudio();
  } else {
    playAudio();
  }
}

function playAudio() {
  isPlaying = true;
  setPlayButtonUI(true);
  activeEngine = determinePlaybackMode();
  updateAudioModeBadge();

  console.log(`▶️ [Radio Mường Lầm] Bắt đầu phát Tập ${currentTrackIndex + 1} qua chế độ: ${activeEngine}`);

  if (activeEngine === 'mp3') {
    const track = podcastEpisodes[currentTrackIndex];
    if (track.audioUrl && realAudio) {
      realAudio.src = track.audioUrl;
      realAudio.play().catch(e => {
        console.warn("⚠️ [Radio Mường Lầm] File MP3 lỗi, chuyển sang TTS:", e);
        activeEngine = vietnameseVoice ? 'speech' : 'stream';
        updateAudioModeBadge();
        playLine(currentLineIndex);
      });
    } else {
      activeEngine = vietnameseVoice ? 'speech' : 'stream';
      updateAudioModeBadge();
      playLine(currentLineIndex);
    }
  } else {
    playLine(currentLineIndex);
  }

  startElapsedTimer();
}

function playLine(lineIdx) {
  const track = podcastEpisodes[currentTrackIndex];
  if (!track.speechLines || lineIdx >= track.speechLines.length) {
    finishEpisode();
    return;
  }

  currentLineIndex = lineIdx;
  hasFallenBackThisLine = false;
  const line = track.speechLines[lineIdx];

  // Tiền xử lý văn bản phát thanh viên (phiên âm số, ngắt nghỉ dấu câu)
  const formattedText = prepareSpeechText(line.text);
  currentLineChunks = splitIntoNaturalClauses(formattedText, 120);
  currentChunkIndex = 0;

  // Cập nhật phụ đề UI
  updateSubtitleUI(line, lineIdx, track.speechLines.length);

  if (activeEngine === 'stream') {
    playTTSClause();
  } else {
    playWebSpeechClause();
  }
}

// --- ENGINE 1: GOOGLE TTS AUDIO STREAM (100% TIẾNG VIỆT QUA NO-REFERRER) ---
function playTTSClause() {
  if (!isPlaying || !realAudio) return;

  if (currentChunkIndex >= currentLineChunks.length) {
    clearTimeout(nextLineTimeout);
    nextLineTimeout = setTimeout(() => {
      if (isPlaying) {
        playLine(currentLineIndex + 1);
      }
    }, 300); // Nghỉ 300ms giữa các câu thoại
    return;
  }

  const chunkText = currentLineChunks[currentChunkIndex];
  const encodedText = encodeURIComponent(chunkText);
  const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=vi&client=tw-ob&q=${encodedText}`;

  realAudio.src = ttsUrl;
  realAudio.volume = currentVolume;
  realAudio.muted = isMuted;
  realAudio.playbackRate = currentSpeed; // Tốc độ tối ưu 1.13x

  realAudio.onended = () => {
    if (isPlaying) {
      currentChunkIndex++;
      setTimeout(() => {
        playTTSClause();
      }, 100); // Nghỉ nhẹ 100ms giữa các vế câu
    }
  };

  realAudio.onerror = (e) => {
    console.warn("⚠️ [TTS Stream Error]:", e);
    if (isPlaying && !hasFallenBackThisLine) {
      hasFallenBackThisLine = true;
      console.log("🔄 Chuyển sang Web Speech API cho câu này");
      activeEngine = 'speech';
      updateAudioModeBadge();
      playWebSpeechClause();
    } else if (isPlaying) {
      currentChunkIndex++;
      playTTSClause();
    }
  };

  realAudio.play().catch(err => {
    console.warn("⚠️ [TTS Stream Play]:", err);
    if (isPlaying && !hasFallenBackThisLine) {
      hasFallenBackThisLine = true;
      activeEngine = 'speech';
      updateAudioModeBadge();
      playWebSpeechClause();
    }
  });
}

// --- ENGINE 2: WEB SPEECH API (GIỌNG TRÌNH DUYỆT TỰ NHIÊN) ---
function playWebSpeechClause() {
  if (!isPlaying) return;

  if (!('speechSynthesis' in window)) {
    activeEngine = 'stream';
    updateAudioModeBadge();
    playTTSClause();
    return;
  }

  if (currentChunkIndex >= currentLineChunks.length) {
    clearTimeout(nextLineTimeout);
    nextLineTimeout = setTimeout(() => {
      if (isPlaying) {
        playLine(currentLineIndex + 1);
      }
    }, 300); // Nghỉ 300ms giữa các câu thoại
    return;
  }

  const clauseText = currentLineChunks[currentChunkIndex];
  const utterance = new SpeechSynthesisUtterance(clauseText);
  utterance.lang = 'vi-VN';
  utterance.rate = currentSpeed; // 1.13x chuẩn phát thanh
  utterance.pitch = currentPitch; // 1.04 cao độ ấm áp
  utterance.volume = currentVolume;

  if (vietnameseVoice) {
    utterance.voice = vietnameseVoice;
  }

  utterance.onend = () => {
    if (isPlaying) {
      currentChunkIndex++;
      setTimeout(() => {
        playWebSpeechClause();
      }, 100); // Nghỉ nhẹ 100ms giữa các vế câu
    }
  };

  utterance.onerror = (event) => {
    console.warn("⚠️ [WebSpeech Error]:", event.error);
    if (event.error !== 'canceled' && isPlaying) {
      if (!hasFallenBackThisLine) {
        hasFallenBackThisLine = true;
        console.log("🔄 Chuyển sang TTS Stream cho câu thoại này");
        activeEngine = 'stream';
        updateAudioModeBadge();
        playTTSClause();
      } else {
        currentChunkIndex++;
        playWebSpeechClause();
      }
    }
  };

  try {
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn("⚠️ [WebSpeech Exception]:", err);
  }
}

function updateSubtitleUI(line, lineIdx, totalLines) {
  if (subtitleSpeaker) subtitleSpeaker.textContent = line.speaker;
  if (subtitleText) subtitleText.textContent = `"${line.text}"`;
  if (subtitleStatus) subtitleStatus.textContent = `Câu ${lineIdx + 1}/${totalLines}`;

  if (subtitleSpeakerIcon) {
    if (line.speaker.includes('MC')) {
      subtitleSpeakerIcon.className = "fa-solid fa-tower-broadcast text-amber-400";
    } else if (line.speaker.includes('Cô') || line.speaker.includes('Thầy') || line.speaker.includes('Công An')) {
      subtitleSpeakerIcon.className = "fa-solid fa-shield text-blue-400";
    } else {
      subtitleSpeakerIcon.className = "fa-solid fa-comment-dots text-emerald-400";
    }
  }

  if (progressBar) {
    const percent = ((lineIdx + 1) / totalLines) * 100;
    progressBar.style.width = `${percent}%`;
  }
}

function pauseAudio() {
  isPlaying = false;
  setPlayButtonUI(false);
  clearInterval(speechTimer);
  clearTimeout(nextLineTimeout);

  if (realAudio) {
    realAudio.pause();
  }

  if ('speechSynthesis' in window) {
    window.speechSynthesis.pause();
  }

  if (subtitleStatus) subtitleStatus.textContent = "Đang tạm dừng";
}

function stopAllAudio() {
  isPlaying = false;
  setPlayButtonUI(false);
  clearInterval(speechTimer);
  clearTimeout(nextLineTimeout);

  if (realAudio) {
    realAudio.pause();
    realAudio.removeAttribute('src');
    realAudio.load();
  }

  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch(e) {}
  }
}

function finishEpisode() {
  stopAllAudio();
  if (subtitleSpeaker) subtitleSpeaker.textContent = "🎙️ Kết Thúc Chương Trình";
  if (subtitleText) subtitleText.textContent = "Bạn đã nghe hết tập này. Hãy chọn tập tiếp theo hoặc gửi tâm sự về Hòm thư!";
  if (subtitleStatus) subtitleStatus.textContent = "Hoàn thành";
  if (progressBar) progressBar.style.width = '100%';
  
  // Tự động chuyển tập kế tiếp sau 2.5s
  setTimeout(() => {
    nextTrack();
  }, 2500);
}

function setPlayButtonUI(playing) {
  if (playing) {
    if (playIcon) {
      playIcon.classList.remove('fa-play', 'ml-0.5');
      playIcon.classList.add('fa-pause');
    }
    if (centerPlayIcon) {
      centerPlayIcon.classList.remove('fa-microphone-lines');
      centerPlayIcon.classList.add('fa-volume-high', 'animate-pulse');
    }
    if (waveContainer) {
      waveContainer.classList.remove('opacity-40');
      waveContainer.classList.add('opacity-100');
    }
  } else {
    if (playIcon) {
      playIcon.classList.remove('fa-pause');
      playIcon.classList.add('fa-play', 'ml-0.5');
    }
    if (centerPlayIcon) {
      centerPlayIcon.classList.remove('fa-volume-high', 'animate-pulse');
      centerPlayIcon.classList.add('fa-microphone-lines');
    }
    if (waveContainer) {
      waveContainer.classList.remove('opacity-100');
      waveContainer.classList.add('opacity-40');
    }
  }
}

function startElapsedTimer() {
  clearInterval(speechTimer);
  speechTimer = setInterval(() => {
    elapsedSeconds++;
    const mins = Math.floor(elapsedSeconds / 60);
    const secs = elapsedSeconds % 60;
    if (currentTimeEl) {
      currentTimeEl.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
  }, 1000);
}

function nextTrack() {
  let nextIndex = (currentTrackIndex + 1) % podcastEpisodes.length;
  loadTrack(nextIndex);
  playAudio();
}

function prevTrack() {
  let prevIndex = (currentTrackIndex - 1 + podcastEpisodes.length) % podcastEpisodes.length;
  loadTrack(prevIndex);
  playAudio();
}

// Scrubber click - tua vị trí phát
const progressBarContainer = document.getElementById('progressBarContainer');
if (progressBarContainer) {
  progressBarContainer.addEventListener('click', (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percent = clickX / width;

    const track = podcastEpisodes[currentTrackIndex];

    if (activeEngine === 'mp3' && realAudio && realAudio.duration) {
      realAudio.currentTime = percent * realAudio.duration;
    } else if (track.speechLines && track.speechLines.length > 0) {
      const targetIndex = Math.floor(percent * track.speechLines.length);
      currentLineIndex = Math.min(targetIndex, track.speechLines.length - 1);
      
      stopAllAudio();
      if (progressBar) progressBar.style.width = `${percent * 100}%`;

      if (isPlaying) {
        playAudio();
      } else {
        const line = track.speechLines[currentLineIndex];
        updateSubtitleUI(line, currentLineIndex, track.speechLines.length);
        if (subtitleStatus) subtitleStatus.textContent = `Đã tua đến câu ${currentLineIndex + 1}`;
      }
    }
  });
}

// Điều chỉnh âm lượng & nút Mute
if (volumeSlider) {
  volumeSlider.addEventListener('input', (e) => {
    currentVolume = parseFloat(e.target.value);
    if (realAudio) realAudio.volume = currentVolume;
    isMuted = currentVolume === 0;
    updateVolumeIcon();
  });
}

if (muteBtn) {
  muteBtn.addEventListener('click', () => {
    isMuted = !isMuted;
    if (realAudio) realAudio.muted = isMuted;
    updateVolumeIcon();
  });
}

function updateVolumeIcon() {
  if (!volumeIcon) return;
  if (isMuted || currentVolume === 0) {
    volumeIcon.className = "fa-solid fa-volume-xmark text-red-400";
  } else if (currentVolume < 0.5) {
    volumeIcon.className = "fa-solid fa-volume-low text-slate-300";
  } else {
    volumeIcon.className = "fa-solid fa-volume-high text-slate-300";
  }
}

// Bộ chọn Engine âm thanh
if (engineSelector) {
  engineSelector.addEventListener('change', () => {
    const wasPlaying = isPlaying;
    stopAllAudio();
    updateAudioModeBadge();
    if (wasPlaying) {
      playAudio();
    }
  });
}

// Bộ chọn tốc độ đọc (1.0x, 1.13x, 1.25x)
if (speedSelector) {
  speedSelector.addEventListener('change', (e) => {
    currentSpeed = parseFloat(e.target.value);
    if (realAudio) {
      realAudio.playbackRate = currentSpeed;
    }
    console.log(`⚡ [Radio Mường Lầm] Tốc độ đọc cập nhật: ${currentSpeed}x`);
  });
}

// Gán sự kiện cho các nút điều khiển chính
if (mainPlayBtn) mainPlayBtn.addEventListener('click', togglePlay);
if (nextTrackBtn) nextTrackBtn.addEventListener('click', nextTrack);
if (prevTrackBtn) prevTrackBtn.addEventListener('click', prevTrack);

playlistCards.forEach(card => {
  card.addEventListener('click', () => {
    const idx = parseInt(card.getAttribute('data-index'), 10);
    loadTrack(idx);
    playAudio();
  });
});


// --- 3. MODAL XEM TOÀN VĂN KỊCH BẢN RADIO ---
const scriptModal = document.getElementById('scriptModal');
const openScriptModalBtn = document.getElementById('openScriptModalBtn');
const closeScriptModalBtn = document.getElementById('closeScriptModalBtn');
const closeScriptModalBtn2 = document.getElementById('closeScriptModalBtn2');
const modalEpNumber = document.getElementById('modalEpNumber');
const modalEpTitle = document.getElementById('modalEpTitle');
const modalBody = document.getElementById('modalBody');

function openModal() {
  if (!scriptModal) return;
  const track = podcastEpisodes[currentTrackIndex];
  if (modalEpNumber) modalEpNumber.textContent = `Kịch bản chi tiết Tập ${currentTrackIndex + 1}`;
  if (modalEpTitle) modalEpTitle.textContent = track.title;
  if (modalBody) modalBody.innerHTML = track.scriptSummary;
  scriptModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  if (!scriptModal) return;
  scriptModal.classList.add('hidden');
  document.body.style.overflow = 'auto';
}

if (openScriptModalBtn) openScriptModalBtn.addEventListener('click', openModal);
if (closeScriptModalBtn) closeScriptModalBtn.addEventListener('click', closeModal);
if (closeScriptModalBtn2) closeScriptModalBtn2.addEventListener('click', closeModal);
if (scriptModal) {
  scriptModal.addEventListener('click', (e) => {
    if (e.target === scriptModal) closeModal();
  });
}


// --- 4. HÒM THƯ "ĐIỀU EM MUỐN NÓI" ẨN DANH ---
const confessionForm = document.getElementById('confessionForm');
const anonymousToggle = document.getElementById('anonymousToggle');
const personalInfoFields = document.getElementById('personalInfoFields');
const messageContent = document.getElementById('messageContent');
const charCount = document.getElementById('charCount');

if (anonymousToggle && personalInfoFields) {
  anonymousToggle.addEventListener('change', (e) => {
    if (e.target.checked) {
      personalInfoFields.classList.add('hidden');
    } else {
      personalInfoFields.classList.remove('hidden');
    }
  });
}

if (messageContent && charCount) {
  messageContent.addEventListener('input', (e) => {
    charCount.textContent = `${e.target.value.length}/1000 ký tự`;
  });
}

if (confessionForm) {
  confessionForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const isAnon = anonymousToggle ? anonymousToggle.checked : true;
    const senderNameEl = document.getElementById('senderName');
    const name = isAnon ? 'Học sinh ẩn danh' : (senderNameEl && senderNameEl.value.trim() ? senderNameEl.value.trim() : 'Bạn học sinh');

    // Bắn pháo hoa Confetti chúc mừng
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.8 }
      });
    }

    alert(`✅ Cảm ơn ${name}! Tâm sự của bạn đã được gửi an toàn đến Ban Chấp hành Đoàn Trường THPT Mường Lầm. Thầy cô và Đoàn trường cam kết lắng nghe và đồng hành bảo vệ bạn.`);
    confessionForm.reset();
    if (charCount) charCount.textContent = `0/1000 ký tự`;
    if (anonymousToggle && anonymousToggle.checked && personalInfoFields) {
      personalInfoFields.classList.add('hidden');
    }
  });
}


// --- 5. BẢNG VÀNG CAM KẾT ĐIỆN TỬ ---
const pledgeForm = document.getElementById('pledgeForm');
const pledgeName = document.getElementById('pledgeName');
const pledgeClass = document.getElementById('pledgeClass');
const liveCommitmentCount = document.getElementById('liveCommitmentCount');
const heroPledgeCount = document.getElementById('heroPledgeCount');
const pledgeTicker = document.getElementById('pledgeTicker');

let currentCommitments = 842;

if (pledgeForm) {
  pledgeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = pledgeName ? pledgeName.value.trim() : '';
    const cls = pledgeClass ? pledgeClass.value : '';

    if (!name || !cls) return;

    // Tăng số lượng cam kết
    currentCommitments++;
    if (liveCommitmentCount) liveCommitmentCount.textContent = currentCommitments;
    if (heroPledgeCount) heroPledgeCount.textContent = `${currentCommitments}+`;

    // Hiệu ứng pháo hoa lớn ăn mừng
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 }
      });
    }

    // Thêm tên vào dòng chữ chạy (Ticker)
    if (pledgeTicker) {
      const newPledgeItem = document.createElement('span');
      newPledgeItem.className = 'inline-flex items-center gap-2 text-xs font-bold text-slate-800 bg-amber-100 border border-amber-300 px-3 py-1 rounded-full shadow-sm animate-pulse';
      newPledgeItem.innerHTML = `<i class="fa-solid fa-star text-amber-500"></i> ${name} (${cls}) vừa ký cam kết!`;
      pledgeTicker.prepend(newPledgeItem);
    }

    alert(`🎉 CHÚC MỪNG BẠN ${name.toUpperCase()} (${cls})!\nBạn vừa hoàn thành ký cam kết xây dựng tình bạn đẹp tại Trường THPT Mường Lầm năm học 2026 - 2027.`);
    
    if (pledgeName) pledgeName.value = '';
    if (pledgeClass) pledgeClass.value = '';
  });
}


// --- 6. MENU ĐIỀU HƯỚNG MOBILE RESPONSIVE ---
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

if (mobileMenuBtn && mobileMenu) {
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });
}

if (mobileNavLinks && mobileMenu) {
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
    });
  });
}

// Khởi chạy nạp tập 1 khi tải trang xong
document.addEventListener('DOMContentLoaded', () => {
  loadTrack(0);
});
// Fallback nếu DOMContentLoaded đã kích hoạt trước đó
if (document.readyState === 'interactive' || document.readyState === 'complete') {
  loadTrack(0);
}
