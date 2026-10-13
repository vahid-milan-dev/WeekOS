# Weekly progress synchronization

Weekly Progress is derived from `state.tasks` and `state.activities`, using the displayed Monday-to-Sunday week (`startOfWeek()` plus six days). Each scheduled occurrence is counted once using kind, ID, and date. Completed is numerator; Completed, Not Completed and Unmarked all count in denominator. A zero-task week displays 0%. University classes are **excluded** from task progress; their attendance is tracked separately by occurrence date in `state.attendance`.

Recurring task and activity statuses use `state.taskOccurrences[date + "|" + id]`; nonrecurring items use `item.status`. Status changes call the shared save/render path and refresh weekly metrics immediately. No server or module imports required.

Test: create four dated tasks in the displayed week, check 0, 25, 50, 25, 100 percent when toggling statuses, then switch weeks and reopen the HTML file. Storage persistence for `file://` is browser-specific.
