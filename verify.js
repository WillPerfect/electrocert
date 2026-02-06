// 生成随机验证码
function generateCaptcha() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// 刷新验证码
function reloadCaptcha() {
  const captchaCode = document.getElementById('captchaCode');
  const newCode = generateCaptcha();
  captchaCode.textContent = newCode;
  captchaCode.dataset.code = newCode;
  document.getElementById('captchaInput').value = ''; // 清空输入框
  // 清除错误提示
  document.getElementById('topWarning').style.display = 'none';
}

// 生成新的验证码但不清除警告
function generateNewCaptcha() {
  const captchaCode = document.getElementById('captchaCode');
  const newCode = generateCaptcha();
  captchaCode.textContent = newCode;
  captchaCode.dataset.code = newCode;
  document.getElementById('captchaInput').value = ''; // 清空输入框
}

// 显示错误提示
function showWarning(message) {
  const topWarning = document.getElementById('topWarning');
  topWarning.textContent = message;
  topWarning.style.display = 'block';
}

// 隐藏错误提示
function hideWarning() {
  document.getElementById('topWarning').style.display = 'none';
}

// 验证按钮点击事件
function verify() {
  const inputCode = document.getElementById('captchaInput').value.toUpperCase();
  const correctCode = document.getElementById('captchaCode').dataset.code;

  if (!inputCode) {
    showWarning('请输入验证码');
    return;
  }

  if (inputCode !== correctCode) {
    showWarning('警告：验证码不正确。');
    generateNewCaptcha();
    return;
  }

  // 验证码正确，检查证书信息
  const utnInputs = document.querySelectorAll('.utn input');
  const utnInput1 = utnInputs[0].value;
  const utnInput2 = utnInputs[1].value;
  const certInput = document.getElementById('certInput').value;

  if (utnInput1 !== 'P026' || utnInput2 !== '10374721' || certInput !== 'SH25PPS04726') {
    showWarning('警告：未找到证书，可能未发放或已过期，请联系检验单位核实。');
    return;
  }

  // 所有验证通过
  hideWarning();
  // 跳转到第二个页面
  window.location.href = 'page2.html';
}

// 页面加载时初始化验证码
document.addEventListener('DOMContentLoaded', function() {
  reloadCaptcha();
  
  // 点击验证码图片刷新
  document.getElementById('captchaCode').addEventListener('click', reloadCaptcha);
  
  // 回车提交
  document.getElementById('captchaInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      verify();
    }
  });
});
