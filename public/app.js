document.querySelector('.letter-box').focus();

// Auto-advance focus through letter boxes
document.querySelectorAll('.letter-box').forEach((box) => {
  box.addEventListener('input', (e) => {
    const val = e.target.value.replace(/[^a-zA-Z]/g, '');
    e.target.value = val.toUpperCase().slice(-1);
    if (val) {
      const sameRow = [...e.target.closest('.letter-row').querySelectorAll('.letter-box')];
      const rowIdx = sameRow.indexOf(e.target);
      if (rowIdx < sameRow.length - 1) {
        sameRow[rowIdx + 1].focus();
      }
    }
  });

  box.addEventListener('keydown', (e) => {
    const sameRow = [...e.target.closest('.letter-row').querySelectorAll('.letter-box')];
    const rowIdx = sameRow.indexOf(e.target);
    if (e.key === 'Backspace' && !e.target.value && rowIdx > 0) {
      sameRow[rowIdx - 1].focus();
    }
    if (e.key === 'ArrowLeft' && rowIdx > 0) {
      e.preventDefault();
      sameRow[rowIdx - 1].focus();
    }
    if (e.key === 'ArrowRight' && rowIdx < sameRow.length - 1) {
      e.preventDefault();
      sameRow[rowIdx + 1].focus();
    }
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      const allRows = [...document.querySelectorAll('.letter-row')];
      const currentRow = e.target.closest('.letter-row');
      const rowListIdx = allRows.indexOf(currentRow);
      const targetRow = e.key === 'ArrowUp' ? allRows[rowListIdx - 1] : allRows[rowListIdx + 1];
      if (targetRow) {
        const targetBoxes = [...targetRow.querySelectorAll('.letter-box')];
        targetBoxes[rowIdx]?.focus();
      }
    }
    if (e.key === 'Enter') {
      filterWords();
    }
  });
});

document.getElementById('excluded').addEventListener('input', (e) => {
  e.target.value = e.target.value.replace(/[^a-zA-Z]/g, '').toUpperCase();
});

document.getElementById('excluded').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') filterWords();
});

async function filterWords() {
  const correct = Array(5).fill('');
  document.querySelectorAll('.green-box').forEach((box) => {
    correct[parseInt(box.dataset.pos)] = box.value.toUpperCase();
  });

  const misplaced = Array(5).fill('');
  document.querySelectorAll('.yellow-box').forEach((box) => {
    misplaced[parseInt(box.dataset.mispos)] = box.value.toUpperCase();
  });

  const excluded = document.getElementById('excluded').value.toUpperCase();

  const params = new URLSearchParams();
  correct.forEach(l => params.append('correct', l));
  misplaced.forEach(l => params.append('misplaced', l));
  params.set('excluded', excluded);

  const resultsEl = document.getElementById('results');
  const headerEl = document.getElementById('results-header');

  try {
    const res = await fetch(`/api/words?${params}`);
    const matches = await res.json();

    if (matches.length === 0) {
      headerEl.textContent = 'No matching words found';
      resultsEl.innerHTML = '<span class="no-results">Try adjusting your criteria</span>';
      return;
    }

    headerEl.textContent = `${matches.length} matching word${matches.length !== 1 ? 's' : ''}`;
    resultsEl.innerHTML = matches
      .map(({ word, pastAnswer }) =>
        `<span class="word-chip${pastAnswer ? ' past-answer' : ''}">${word}</span>`)
      .join('');
  } catch {
    headerEl.textContent = 'Error fetching results';
    resultsEl.innerHTML = '<span class="no-results">Could not reach server</span>';
  }
}

function resetAll() {
  document.querySelectorAll('.letter-box').forEach((b) => (b.value = ''));
  document.getElementById('excluded').value = '';
  document.getElementById('results').innerHTML = '';
  document.getElementById('results-header').textContent = '';
  document.querySelector('.green-box').focus();
}
