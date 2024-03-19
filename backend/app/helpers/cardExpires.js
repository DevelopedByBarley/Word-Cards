function expires(state, date) {
  switch (state) {
    case 1:
      date.setDate(date.getDate() + 2); // Add 1 day
      break;
    case 2:
      date.setDate(date.getDate() + 3); // Add 2 days
      break;
    case 3:
      date.setDate(date.getDate() + 7); // Add 3 days
      break;
    case 4:
      date.setDate(date.getDate() + 14); // Add 1 week
      break;
    case 5:
      date.setDate(date.getDate() + 21); // Add 2 weeks
      break;
    case 6:
      date.setDate(date.getDate() + 28); // Add 4 weeks
      break;
    default:
      console.error("Something went wrong in the expires system.");
      break;
  }

  return date;
}

module.exports = expires;

/* // Example usage:
const currentDate = new Date(); // Current date
const expirationDate = new Date(currentDate);
expires(1, expirationDate);
console.log(expirationDate); // Output will be the expiration date based on the state
 */