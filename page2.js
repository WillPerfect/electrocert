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
}

// 验证按钮点击事件（在page2中不做任何操作）
function verify() {
  // 在page2中验证按钮不需要动作
  return false;
}

// 打开证书PDF
function openCertificate() {
  window.open('cert1.pdf', '_blank');
}

// 下载证书
function downloadCertificate() {
  const link = document.createElement('a');
  link.href = 'cert1.pdf';
  link.download = 'cert1.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
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
