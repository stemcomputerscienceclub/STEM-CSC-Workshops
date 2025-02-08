document.addEventListener("DOMContentLoaded", () => {

  const membershipForm = document.getElementById('membershipForm');
  membershipForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    // Gather form data
    const formData = {
      fullName: document.getElementById('fullName').value.trim(),
      whatsapp: document.getElementById('whatsapp').value.trim(),
      email: document.getElementById('email').value.trim(),
      hasExperience: document.querySelector('input[name="hasExperience"]:checked')?.value || "No",
      class: document.querySelector('input[name="class"]:checked')?.value || "No",
      grade: document.querySelector('input[name="class"]:checked')?.value || "No"
    };

    // Google Form POST URL
    const formUrl = "https://docs.google.com/forms/d/e/1FAIpQLSfInMBvk2F9LtOn56libOO3t6DXTDj8vuxDoJQsHiCkQm5Gfw/formResponse";

    // Map form data to Google Form entry fields
    const response = new URLSearchParams();
    response.append("entry.219102366", formData.fullName);   // Full Name
    response.append("entry.440115894", formData.whatsapp);   // WhatsApp
    response.append("entry.1733868244", formData.email);     // Email
    response.append("entry.1129972581", formData.hasExperience); // Experience
    response.append("entry.643872821", formData.class);  // Class
    response.append("entry.1848512757", formData.grade); // Grade

    // Send the request
    fetch(formUrl, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: response
    }).then(() => {

      // Show success modal
      const successModal = document.getElementById('successModal');
      if (successModal) {
        successModal.classList.add('active');
        // Animate loading bar
        const loadingBar = document.getElementById('loadingBar');
        if (loadingBar) {
          setTimeout(() => {
            loadingBar.style.width = '100%';
          }, 100);
        }
      }

      // Clear localStorage since submission is done
      localStorage.removeItem('csclubFormData');

      // Optionally reset form
      membershipForm.reset();

    }).catch(error => {
      console.error('Error submitting application:', error);
      alert('An error occurred while submitting. Please try again.');
    })
  })

  /**********************************************
   * Close Modal
  **********************************************/
  window.closeModal = function () {
    const successModal = document.getElementById('successModal');
    if (successModal) {
      successModal.classList.remove('active');
      localStorage.setItem('submitted', true)
      document.getElementById("application").innerHTML = `<section id="apply" class="application-form">
    <h1>Your application was already submitted, no decision update yet</h1></section>`
    }
    // Optionally redirect:
    // window.location.href = 'index.html';
  };

  /**********************************************
   * Matrix Background Animation
  **********************************************/
  const canvas = document.getElementById('matrixCanvas');
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function initMatrix() {
    resizeCanvas();

    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = new Array(columns).fill(1);

    ctx.font = fontSize + 'px monospace';

    function draw() {
      ctx.fillStyle = 'rgba(0, 24, 48, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#0fa';

      for (let i = 0; i < drops.length; i++) {
        const text = String.fromCharCode(0x30A0 + Math.random() * 96);
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillText(text, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    let animationFrame;
    function animate() {
      draw();
      animationFrame = requestAnimationFrame(animate);
    }
    animate();

    // Cleanup if needed
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }

  window.addEventListener('resize', resizeCanvas);
  initMatrix();

})