// 数据验证列表
const validateData = {
  validate: [
    {
      "utn-1": "P026",
      "utn-2": "10241201",
      "certificate": "SH25PPS03982",
      "product": "Air Compressor",
      "date": "2026-02-05",
      "sn": "18AI801~804"
    }
  ]
};

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
  let utn1 = sessionStorage.getItem('utn1');
  let utn2 = sessionStorage.getItem('utn2');
  let cert = sessionStorage.getItem('cert');

  // 如果没有获取到信息，使用 validateData 中的第一条记录作为默认值
  if (!utn1 || !utn2 || !cert) {
    if (validateData.validate && validateData.validate.length > 0) {
      const defaultRecord = validateData.validate[0];
      utn1 = defaultRecord['utn-1'];
      utn2 = defaultRecord['utn-2'];
      cert = defaultRecord['certificate'];
    } else {
      // 如果没有默认数据，则重定向回首页
      window.location.href = 'index.html';
      return;
    }
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

  // 从validateData中查找对应的记录，获取product, date, sn信息
  const record = validateData.validate.find(item => 
    item['utn-1'] === utn1 && item['utn-2'] === utn2 && item['certificate'] === cert
  );

  if (record) {
    // 更新产品名称
    const productValue = document.getElementById('productValue');
    if (productValue) {
      productValue.textContent = record.product;
    }

    // 更新签发日期
    const dateValue = document.getElementById('dateValue');
    if (dateValue) {
      dateValue.textContent = record.date;
    }

    // 更新序号
    const snValue = document.getElementById('snValue');
    if (snValue) {
      snValue.textContent = record.sn;
    }

    // 保存 PDF 文件信息
    window.certificateValue = record.certificate;
  }
});

// 打开证书 PDF 文件
function openCertificate() {
  const certValue = window.certificateValue;
  if (certValue) {
    // 使用新的URL格式
    const pdfUrl = 'sqdownloadEcertPdf.do!fileName=' + certValue + '.pdf';
    window.open(pdfUrl, '_blank');
  } else {
    alert('无法获取证书文件');
  }
}
