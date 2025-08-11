//supabase 관련 JS
const supabaseUrl = 'https://iiskzhqeshvyjkyvsvhz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlpc2t6aHFlc2h2eWpreXZzdmh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NDU0MDQsImV4cCI6MjA2OTUyMTQwNH0.IuPIflTHUWDkR7bSwqP_A5WrUhuasXqbCdlyTzJtcL4'
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// 중복 체크 상태와 마지막 검사한 아이디 저장용 변수
let idCheckPassed = false;
let lastCheckedUsername = '';

document.addEventListener('DOMContentLoaded', function () {
    // 아이디 중복 확인 버튼 클릭 이벤트
    document.querySelector('.check-btn').addEventListener('click', async function () {
        const usernameValue = document.getElementById('username').value.trim();

        if (usernameValue === '') {
            alert('아이디를 입력해주세요');
            return;
        }

        // 중복 체크 쿼리
        const { data, error } = await supabaseClient
            .from('userinfo')
            .select('username')
            .eq('username', usernameValue);

        console.log('중복확인 data:', data, 'error:', error);

        if (error) {
            alert('중복 확인 중 오류가 발생했습니다: ' + error.message);
            idCheckPassed = false;
            lastCheckedUsername = '';
            return;
        }

        const isDuplicate = Array.isArray(data) && data.length > 0;

        if (isDuplicate) {
            alert('❌ 사용 불가능한 아이디입니다');
            idCheckPassed = false;
            lastCheckedUsername = '';
        } else {
            alert('✅ 사용 가능한 아이디입니다');
            idCheckPassed = true;
            lastCheckedUsername = usernameValue;
        }
    });

    // 비밀번호 일치 확인 이벤트
    const passwordInput = document.getElementById('password');
    const confirmInput = document.getElementById('confirm');

    confirmInput.addEventListener('input', function () {
        const pw = passwordInput.value;
        const confirm = confirmInput.value;

        const existingWarning = document.querySelector('.pw-warning');
        if (existingWarning) existingWarning.remove();

        if (pw && confirm && pw !== confirm) {
            const warning = document.createElement('div');
            warning.className = 'pw-warning';
            warning.textContent = '비밀번호가 일치하지 않습니다';
            warning.style.color = 'red';
            warning.style.fontSize = '13px';
            confirmInput.insertAdjacentElement('afterend', warning);
        }
    });

    // 회원가입 버튼 클릭 이벤트
    let isSigningUp = false;
    document.querySelector('.start-btn').addEventListener('click', async function (e) {
        e.preventDefault();

        if (isSigningUp) return;   // 중복 클릭 방지
        isSigningUp = true;
        this.disabled = true;

        const idValue = document.getElementById('username').value.trim(); // username(ID)
        const emailValue = document.getElementById('email').value.trim();
        const pw = document.getElementById('password').value;
        const confirm = document.getElementById('confirm').value;

        // 아이디 중복 체크 결과 재검증 (입력값과 동기화)
        if (!idCheckPassed || idValue !== lastCheckedUsername) {
            alert('아이디 중복 확인을 다시 해주세요');
            this.disabled = false;
            isSigningUp = false;
            return;
        }

        if (emailValue === '') {
            alert('이메일을 입력해주세요');
            this.disabled = false;
            isSigningUp = false;
            return;
        }

        // 간단한 이메일 형식 검증
        const emailReg = /\S+@\S+\.\S+/;
        if (!emailReg.test(emailValue)) {
            alert('유효한 이메일을 입력해주세요');
            this.disabled = false;
            isSigningUp = false;
            return;
        }

        if (pw === '' || confirm === '') {
            alert('비밀번호를 입력해주세요');
            this.disabled = false;
            isSigningUp = false;
            return;
        }

        if (pw.length < 6) {
            alert('비밀번호는 최소 6자 이상이어야 합니다.');
            this.disabled = false;
            isSigningUp = false;
            return;
        }

        if (pw !== confirm) {
            alert('비밀번호가 일치하지 않습니다');
            this.disabled = false;
            isSigningUp = false;
            return;
        }

        try {
            console.log('[회원가입 시작]', { idValue, emailValue });

            // 회원가입 요청 (Supabase Auth)
            const { data, error } = await supabaseClient.auth.signUp({
                email: emailValue,
                password: pw,
            });

            console.log('[signUp 결과]', data, error);

            if (error) {
                let msg = error.message || '회원가입 중 오류가 발생했습니다.';
                if (msg.includes('Password should be at least 6 characters')) {
                    alert('비밀번호는 최소 6자 이상이어야 합니다.');
                } else if (
                    msg.includes('User already registered') ||
                    msg.includes('duplicate key value violates unique constraint "userinfo_pkey"')
                ) {
                    alert('이미 가입된 아이디(또는 회원정보)입니다.');
                } else {
                    alert('회원가입 실패: ' + msg);
                }
                this.disabled = false;
                isSigningUp = false;
                return;
            }

            // 회원가입 성공 시 userinfo 테이블에 upsert (중복 시 update)
            const { data: upsertData, error: upsertError } = await supabaseClient
                .from('userinfo')
                .upsert([
                    {
                        id: data.user.id,
                        email: emailValue,
                        username: idValue,
                        avatar_url: '',
                    },
                ]);
            console.log('[userinfo upsert 결과]', upsertData, upsertError);

            if (upsertError) {
                alert('사용자 정보 저장 실패: ' + upsertError.message);
                this.disabled = false;
                isSigningUp = false;
                return;
            }

            alert('회원가입 성공!');
            window.location.href = '../html/solux_project_login.html'; // 회원가입 성공 후 이동

        } catch (err) {
            console.error('회원가입 중 예외 발생:', err);
            alert('예기치 않은 오류가 발생했습니다. 다시 시도해주세요.');
        }

        this.disabled = false;
        isSigningUp = false;
    });
});
