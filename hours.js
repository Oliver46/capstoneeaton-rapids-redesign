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
       false                   open as usual
       true                    closed all day
       '8:00 AM – 12:00 PM'    shorter hours that day
     The dates are worked out automatically every year.

     CONFIRM with the practice: all are set to false (open) until the office
     tells you which days it closes.                                        */
  holidays: {
    newYearsDay:          false,   // January 1
    memorialDay:          false,   // last Monday in May
    independenceDay:      false,   // July 4
    laborDay:             false,   // first Monday in September
    thanksgiving:         false,   // 4th Thursday in November
    dayAfterThanksgiving: false,   // the Friday after Thanksgiving
    christmasEve:         false,   // December 24
    christmasDay:         false,   // December 25
    newYearsEve:          false    // December 31
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
  announceDaysAhead: 7
};
