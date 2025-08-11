// Supabase 연결
const supabaseUrl = 'https://iiskzhqeshvyjkyvsvhz.supabase.co';
const supabaseKey = '';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// 로그인 처리
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');

  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;

      if (!email || !password) {
        alert('이메일과 비밀번호를 모두 입력해주세요');
        return;
      }

      try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
          email,
          password,
        });

        console.log('[로그인 응답]', data, error);

        if (error) {
          alert('❌ 로그인 실패: ' + error.message);
          return;
        }

        alert('✅ 로그인 성공!');
        window.location.href = 'solux_project_home.html';

      } catch (err) {
        alert('⚠️ 오류: ' + err.message);
      }
    });
  }
});
