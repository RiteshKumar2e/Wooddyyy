// Generates a day-by-day study schedule from a list of pending topics,
// spreading them across the days available before the exam while
// respecting a daily study-hours budget.

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const MS_PER_DAY = 24 * 60 * 60 * 1000;

// Normalise a date to local midnight so day-counting is stable.
const atMidnight = (d) => {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
};

// Format as local YYYY-MM-DD (avoids the UTC day-shift of toISOString).
const toISODate = (d) => {
  const m = atMidnight(d);
  const yyyy = m.getFullYear();
  const mm = String(m.getMonth() + 1).padStart(2, '0');
  const dd = String(m.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

/**
 * @param {Object}   params
 * @param {Array}    params.topics      Topics to schedule. Each: { _id, title, subjectName, estimatedHours, done }
 * @param {Date}     params.examDate    The exam deadline.
 * @param {number}   [params.dailyHours=2]  Hours available to study per day.
 * @param {Date}     [params.startDate=now] First day topics can be scheduled.
 * @returns {Array}  Schedule sessions: { date, day, subjectName, topic, topicId, durationHours, done }
 */
function generateStudyPlan({ topics = [], examDate, dailyHours = 2, startDate = new Date() }) {
  const pending = topics.filter((t) => !t.done);

  if (pending.length === 0) return [];
  if (!examDate) throw new Error('examDate is required to generate a study plan');

  const start = atMidnight(startDate);
  const exam = atMidnight(examDate);

  // Inclusive day count from start up to (and including) the exam day.
  const totalDays = Math.max(1, Math.floor((exam - start) / MS_PER_DAY) + 1);
  const budget = Math.max(0.5, Number(dailyHours) || 2);

  const schedule = [];
  let dayIndex = 0;
  let hoursUsedToday = 0;

  for (const topic of pending) {
    const duration = Math.max(0.5, Number(topic.estimatedHours) || 1);

    // Move to the next day if this topic would overflow today's budget,
    // unless the day is still empty (a single topic can exceed the budget).
    if (hoursUsedToday > 0 && hoursUsedToday + duration > budget) {
      dayIndex += 1;
      hoursUsedToday = 0;
    }

    // Clamp the day index to the last available day before the exam.
    const cappedDay = Math.min(dayIndex, totalDays - 1);
    const date = new Date(start.getTime() + cappedDay * MS_PER_DAY);

    schedule.push({
      date: toISODate(date),
      day: DAY_LABELS[date.getDay()],
      subjectName: topic.subjectName || '',
      topic: topic.title,
      topicId: topic._id || null,
      durationHours: duration,
      done: false,
    });

    hoursUsedToday += duration;
  }

  return schedule;
}

module.exports = { generateStudyPlan };
