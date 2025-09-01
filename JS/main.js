// Minimal To‑Do logic + Progress, Filters, DnD, Theme, Quotes

const input = document.getElementById('todo-input');
const dateInput = document.getElementById('todo-date');
const catSelect = document.getElementById('todo-cat');
const addBtn = document.getElementById('add-btn');
const list = document.getElementById('todo-list');
const empty = document.getElementById('empty');
const quoteBox = document.getElementById('quote');
const filters = document.querySelectorAll('.filter');
const themeToggle = document.getElementById('theme-toggle');
const progressCircle = document.querySelector('#progress-svg .fg');
const progressText = document.querySelector('#progress-svg .pct');

const quotes = [
	"Start where you are. Use what you have. Do what you can.",
	"Small steps every day.",
	"Action is the foundational key to all success.",
	"Focus on being productive instead of busy.",
	"Done is better than perfect."
];

let activeFilter = 'all';

function setEmptyState() {
	const hasItems = list.children.length > 0;
	empty.hidden = hasItems;
	if (!hasItems) {
		quoteBox.textContent = quotes[Math.floor(Math.random() * quotes.length)];
	}
}

function computeProgress() {
	const items = list.querySelectorAll('.item');
	if (items.length === 0) {
		progressCircle.style.strokeDashoffset = 100;
		progressText.textContent = '0%';
		return;
	}

const done = list.querySelectorAll('.item.done').length;
	const pct = Math.round((done / items.length) * 100);
	progressCircle.style.strokeDashoffset = 100 - pct;
	progressText.textContent = pct + '%';
}

function isDueSoon(iso) {
	if (!iso) return false;
	const now = new Date();
	const due = new Date(iso + 'T23:59:59');
	const diff = due - now;
	const oneDay = 24 * 60 * 60 * 1000;
	return diff > 0 && diff <= oneDay * 2; // within 2 days
}

function renderVisibilityByFilter() {
	[...list.children].forEach(li => {
		const cat = li.getAttribute('data-cat');
		li.style.display = (activeFilter === 'all' || cat === activeFilter) ? '' : 'none';
	});
}

function addItem() {
	const value = (input.value || '').trim();
	if (!value) return;

	const li = document.createElement('li');
	li.className = 'item';
	li.draggable = true;
	li.setAttribute('data-cat', catSelect.value);

	const text = document.createElement('span');
	text.className = 'text';
	text.textContent = value + (dateInput.value ? ' • ' + dateInput.value : '');

	const actions = document.createElement('div');
	actions.className = 'actions';
