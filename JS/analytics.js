// Feature: Progress Analytics (modular, event-driven, no duplication)

(function () {
    // Utility: Get today's date string (YYYY-MM-DD)
    function getToday() {
        return new Date().toISOString().slice(0, 10);
    }

    // Utility: Get all tasks and completed tasks from DOM
    function getTaskElements() {
        const list = document.getElementById('todo-list');
        if (!list) return { all: [], done: [] };
        const all = Array.from(list.querySelectorAll('.item'));
        const done = all.filter(li => li.classList.contains('done'));
        return { all, done };
    }

    // Calculate stats for analytics panel
    function getCompletedTaskStats() {
        const { all, done } = getTaskElements();
        const today = getToday();

        // Completed today: tasks marked done with today's date (or completed today)
        const completedToday = done.filter(li => {
            // If your tasks have a data-date attribute, use that; else fallback to text
            const dateAttr = li.getAttribute('data-date');
            if (dateAttr) return dateAttr === today;
            // fallback: check if text contains today's date
            const text = li.querySelector('.text')?.textContent || '';
            return text.includes(today);
        }).length;

        // Streak: consecutive days with at least one completed task
        let streak = 0;
        let d = new Date();
        for (let i = 0; i < 7; i++) {
            const dayStr = d.toISOString().slice(0, 10);
            const any = done.some(li => {
                const dateAttr = li.getAttribute('data-date');
                if (dateAttr) return dateAttr === dayStr;
                const text = li.querySelector('.text')?.textContent || '';
                return text.includes(dayStr);
            });
            if (any) streak++;
            else break;
            d.setDate(d.getDate() - 1);
        }

        // Weekly goal: percent of tasks completed this week
        let weekDone = 0, weekTotal = 0;
        d = new Date();
        for (let i = 0; i < 7; i++) {
            const dayStr = d.toISOString().slice(0, 10);
            weekDone += done.filter(li => {
                const dateAttr = li.getAttribute('data-date');
                if (dateAttr) return dateAttr === dayStr;
                const text = li.querySelector('.text')?.textContent || '';
                return text.includes(dayStr);
            }).length;
            weekTotal += getTaskElements().all.filter(li => {
                const dateAttr = li.getAttribute('data-date');
                if (dateAttr) return dateAttr === dayStr;
                const text = li.querySelector('.text')?.textContent || '';
                return text.includes(dayStr);
            }).length;
            d.setDate(d.getDate() - 1);
        }
        const weeklyGoal = weekTotal ? Math.round((weekDone / weekTotal) * 100) : 0;

        // Focus time: assume 30min per completed task
        const focusTime = (done.length * 0.5).toFixed(1);

        return {
            completedToday,
            streak,
            weeklyGoal,
            focusTime
        };
    }

    // Render bar chart for last 7 days
    function renderAnalyticsChart(containerId) {
        const ctx = document.getElementById(containerId);
        if (!ctx) return;
        const stats = [];
        let d = new Date();
        for (let i = 6; i >= 0; i--) {
            const day = new Date();
            day.setDate(d.getDate() - i);
            const dayStr = day.toISOString().slice(0, 10);
            const { done } = getTaskElements();
            const count = done.filter(li => {
                const dateAttr = li.getAttribute('data-date');
                if (dateAttr) return dateAttr === dayStr;
                const text = li.querySelector('.text')?.textContent || '';
                return text.includes(dayStr);
            }).length;
            stats.push({ day: dayStr.slice(5), count });
        }
        const w = ctx.width, h = ctx.height;
        const max = Math.max(...stats.map(s => s.count), 1);
        const barW = w / stats.length;
        const g = ctx.getContext('2d');
        g.clearRect(0, 0, w, h);
        stats.forEach((s, i) => {
            const barH = (s.count / max) * (h - 30);
            g.fillStyle = '#4a90e2';
            g.fillRect(i * barW + 10, h - barH - 20, barW - 20, barH);
            g.fillStyle = '#222';
            g.font = '12px sans-serif';
            g.fillText(s.count, i * barW + 16, h - barH - 25);
            g.fillText(s.day, i * barW + 10, h - 5);
        });
    }

    // Update stats in the analytics panel
    function updateTaskStats() {
        const stats = getCompletedTaskStats();
        const set = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.textContent = val;
        };
        set('completed-today', stats.completedToday);
        set('streak-days', stats.streak);
        set('weekly-goal', stats.weeklyGoal + '%');
        set('focus-time', stats.focusTime + 'h');
        renderAnalyticsChart('productivity-chart');
    }

    // Listen for custom events from main.js (or DOM changes)
    function listenForTaskEvents() {
        // Listen for custom events
        document.addEventListener('task-updated', updateTaskStats);
        // Fallback: listen for DOM changes (if main.js doesn't dispatch events)
        const list = document.getElementById('todo-list');
        if (list) {
            const observer = new MutationObserver(() => updateTaskStats());
            observer.observe(list, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'data-date'] });
        }
    }

    // Show/hide analytics panel
    function setupPanelUI() {
        const analyticsBtn = document.getElementById('analytics-btn');
        const panel = document.getElementById('analytics-panel');
        const closeBtn = document.getElementById('close-analytics');
        if (analyticsBtn) analyticsBtn.onclick = () => {
            if (panel) {
                panel.hidden = false;
                updateTaskStats();
            }
        };
        if (closeBtn) closeBtn.onclick = () => { if (panel) panel.hidden = true; };
    }

    // Expose updateTaskStats globally for main.js to call
    window.updateTaskStats = updateTaskStats;

    // Initialize on DOMContentLoaded
    document.addEventListener('DOMContentLoaded', () => {
        updateTaskStats();
        listenForTaskEvents();
        setupPanelUI();
    });
})();
