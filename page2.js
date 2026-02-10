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
  if (captchaCode) {
    const newCode = generateCaptcha();
    captchaCode.textContent = newCode;
    captchaCode.dataset.code = newCode;
  }
  const captchaInput = document.getElementById('captchaInput');
  if (captchaInput) {
    captchaInput.value = '';
  }
}

// 页面加载时获取并显示用户验证信息
document.addEventListener('DOMContentLoaded', function() {
  // 初始化验证码
  reloadCaptcha();
  
  // 点击验证码刷新
  const captchaCode = document.getElementById('captchaCode');
  if (captchaCode) {
    captchaCode.addEventListener('click', reloadCaptcha);
  }
  
  // 从 sessionStorage 中获取用户输入的信息
  const utn1 = sessionStorage.getItem('utn1');
  const utn2 = sessionStorage.getItem('utn2');
  const cert = sessionStorage.getItem('cert');

  // 如果没有获取到信息，说明用户没有通过验证，重定向回首页
  if (!utn1 || !utn2 || !cert) {
    window.location.href = 'index.html';
    return;
  }

  // 更新 UTN 行的显示
  const utnValue = document.getElementById('utnValue');
  if (utnValue) {
    utnValue.textContent = utn1 + '-' + utn2;
  }

  // 更新证书号行的显示
  const certValue = document.getElementById('certValue');
  if (certValue) {
    certValue.textContent = cert;
  }

  // 保存 PDF 文件名到全局变量，供 openCertificate 函数使用
  window.pdfFileName = utn1 + '-' + utn2 + '-' + cert + '.pdf';
});

// 打开证书 PDF 文件
function openCertificate() {
  const pdfFileName = window.pdfFileName;
  if (pdfFileName) {
    // 尝试打开 PDF 文件
    window.open(pdfFileName, '_blank');
  } else {
    alert('无法获取证书文件');
  }
}
