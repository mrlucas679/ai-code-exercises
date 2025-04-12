function calculateUserStatistics(userData) {
  // Calculate average age
  let totalAge = 0;
  for (let i = 0; i < userData.length; i++) {
    totalAge += userData[i].age;
  }
  const averageAge = totalAge / userData.length;

  // Calculate average income
  let totalIncome = 0;
  for (let i = 0; i < userData.length; i++) {
    totalIncome += userData[i].income;
  }
  const averageIncome = totalIncome / userData.length;

  // Calculate average score
  let totalScore = 0;
  for (let i = 0; i < userData.length; i++) {
    totalScore += userData[i].score;
  }
  const averageScore = totalScore / userData.length;

  // Find highest age
  let highestAge = userData[0].age;
  for (let i = 1; i < userData.length; i++) {
    if (userData[i].age > highestAge) {
      highestAge = userData[i].age;
    }
  }

  // Find highest income
  let highestIncome = userData[0].income;
  for (let i = 1; i < userData.length; i++) {
    if (userData[i].income > highestIncome) {
      highestIncome = userData[i].income;
    }
  }

  // Find highest score
  let highestScore = userData[0].score;
  for (let i = 1; i < userData.length; i++) {
    if (userData[i].score > highestScore) {
      highestScore = userData[i].score;
    }
  }

  return {
    age: {
      average: averageAge,
      highest: highestAge
    },
    income: {
      average: averageIncome,
      highest: highestIncome
    },
    score: {
      average: averageScore,
      highest: highestScore
    }
  };
}