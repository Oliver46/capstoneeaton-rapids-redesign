/* ==========================================================================
   CAPSTONE FAMILY PRACTICE: OFFICE HOURS
   ----------------------------------------------------------------------------
   This is the ONLY file to edit when the hours change.
   Change a value, save, upload this file. The whole website updates:
   the hours card at the top, "Open now / Closed", the hours table,
   the footer, the FAQ answer and the information Google reads.

   Rules:
   - Keep the quotes '...' around every time.
   - Write times like this: '8:00 AM – 5:00 PM'   (a normal - also works)
   - Write 'Closed' for a day the office is closed.
   ========================================================================== */
window.CAPSTONE_HOURS = {

  /* 1. REGULAR WEEKLY HOURS ---------------------------------------------- */
  weekly: {
    Monday:    '8:00 AM – 5:00 PM',
    Tuesday:   '8:00 AM – 5:00 PM',
    Wednesday: '8:00 AM – 5:00 PM',
    Thursday:  '8:00 AM – 5:00 PM',
    Friday:    '8:00 AM – 12:00 PM',
    Saturday:  'Closed',
    Sunday:    'Closed'
  },

  /* 2. LUNCH BREAK --------------------------------------------------------
     The time the office closes for lunch, and on which days.
     No lunch break at all? Write:  lunch: false,                          */
  lunch: '12:00 PM – 1:00 PM',
  lunchDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],

  /* 3. HOLIDAYS -------------------------------------------------------------
     For each holiday write ONE of these:
       false                   open as usual (the site still says
                               "Holiday hours may differ, so please call")
       true                    closed all day
       '8:00 AM – 12:00 PM'    shorter hours that day
       'Any other text'        shown as written, e.g. 'Reduced afternoon hours'
     The dates are worked out automatically every year.
     Set by the office in November 2026 (holiday list through 2027).        */
  holidays: {
    newYearsDay:          true,    // January 1
    memorialDay:          true,    // last Monday in May
    independenceDay:      false,   // July 4: not on the office's list
    laborDay:             false,   // first Monday in September: not on the office's list
    thanksgiving:         true,    // 4th Thursday in November
    dayAfterThanksgiving: true,    // the Friday after Thanksgiving
    christmasEve:         'Reduced afternoon hours (call for availability)',   // December 24
    christmasDay:         true,    // December 25
    newYearsEve:          'Reduced afternoon hours (call for availability)'    // December 31
  },

  /* 4. ONE-OFF DAYS -----------------------------------------------------------
     Training days, weather closures, vacations, other holidays.
     Copy the example line, remove the // in front, change it.
     Date = YEAR-MONTH-DAY. Put a comma between lines. Old dates are ignored. */
  specialDates: [
    // { date: '2026-12-26', label: 'Staff training', hours: 'Closed' },
    // { date: '2027-03-12', label: 'Special hours',  hours: '9:00 AM – 1:00 PM' },
  ],

  /* 5. WARNING BEFORE A CLOSURE ----------------------------------------------
     How many days ahead the homepage shows "Upcoming: closed Thursday, Nov 26
     (Thanksgiving Day)". Write 0 to turn it off.                           */
  announceDaysAhead: 7,

  /* 6. LAB HOURS --------------------------------------------------------------
     The in-office lab (blood draws) is run by another agency and has its own
     hours. Same rules as the office hours above.                           */
  lab: {
    weekly: {
      Monday:    '7:15 AM – 4:30 PM',
      Tuesday:   '7:15 AM – 4:30 PM',
      Wednesday: '7:15 AM – 4:30 PM',
      Thursday:  '7:15 AM – 4:30 PM',
      Friday:    '7:15 AM – 12:00 PM',
      Saturday:  'Closed',
      Sunday:    'Closed'
    },
    lunch: '12:00 PM – 1:00 PM',
    lunchDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday']
  }
};
