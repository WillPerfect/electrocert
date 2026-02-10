// 验证数据（直接嵌入，避免 fetch 跨域问题）
const validateData = {
  "validate": [
    {
      "utn-1": "P026",
      "utn-2": "10241201",
      "certificate": "SH25PPS03982"
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
  try {
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

    // 验证码正确，获取用户输入
    const utnInputs = document.querySelectorAll('.utn input');
    const utnInput1 = utnInputs[0].value.trim();
    const utnInput2 = utnInputs[1].value.trim();
    const certInput = document.getElementById('certInput').value.trim();

    console.log('验证开始 - 用户输入:', { utnInput1, utnInput2, certInput });

    if (!utnInput1 || !utnInput2 || !certInput) {
      showWarning('警告：请填写所有必须的信息。');
      return;
    }

    // 从嵌入的数据中验证
    console.log('使用嵌入的验证数据:', validateData);
    
    // 遍历数组的每一个元素
    let found = false;
    let debugInfo = [];
    
    if (!validateData.validate || !Array.isArray(validateData.validate)) {
      throw new Error('Invalid data format: validate is not an array');
    }
    
    for (let i = 0; i < validateData.validate.length; i++) {
      const item = validateData.validate[i];
      const itemUtn1 = String(item['utn-1']).trim();
      const itemUtn2 = String(item['utn-2']).trim();
      const itemCert = String(item['certificate']).trim();
      
      debugInfo.push({
        index: i,
        itemUtn1,
        itemUtn2,
        itemCert,
        match1: itemUtn1 === utnInput1,
        match2: itemUtn2 === utnInput2,
        match3: itemCert === certInput
      });
      
      console.log(`项目 ${i}:`, { itemUtn1, itemUtn2, itemCert });
      console.log(`比较结果:`, {
        'utn1匹配': itemUtn1 === utnInput1,
        'utn2匹配': itemUtn2 === utnInput2,
        'cert匹配': itemCert === certInput
      });
      
      if (itemUtn1 === utnInput1 && itemUtn2 === utnInput2 && itemCert === certInput) {
        found = true;
        console.log('✓ 证书找到！');
        break;
      }
    }

    if (!found) {
      console.error('✗ 未找到匹配的证书。调试信息:', debugInfo);
      showWarning('警告：未找到证书，可能未发放或已过期，请联系检验单位核实。');
      generateNewCaptcha();
      return;
    }

    // 所有验证通过
    console.log('验证通过，准备跳转到验证结果页面...');
    hideWarning();
    
    // 保存用户输入到 sessionStorage
    sessionStorage.setItem('utn1', utnInput1);
    sessionStorage.setItem('utn2', utnInput2);
    sessionStorage.setItem('cert', certInput);
    
    // 延迟 300ms 后跳转，确保 sessionStorage 已保存
    setTimeout(() => {
      window.location.href = 'electrocert_veryfication_getCheckResult.page.html';
    }, 300);
  } catch (error) {
    console.error('验证过程出错:', error);
    showWarning('警告：验证过程出错 - ' + error.message);
    generateNewCaptcha();
  }
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
