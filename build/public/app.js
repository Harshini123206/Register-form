const form = document.getElementById('registrationForm');
const messageEl = document.getElementById('message');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  messageEl.textContent = '';
  messageEl.className = '';

  const payload = {
    username: form.username.value,
    studentName: form.studentName.value,
    studentId: form.studentId.value,
  };

  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    messageEl.textContent = data.message;
    messageEl.className = 'success';
    form.reset();
  } catch (error) {
    messageEl.textContent = error.message;
    messageEl.className = 'error';
  }
});
