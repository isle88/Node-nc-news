const { formatTopics } = require("../utils/utils-seeding");
const { topicData } = require('../db/data/test-data/index')

describe("Seeding functions", () => {
  test("when you pass an empty array, returns an empty array ", () => {
    const input = [];
    const output = [];
    expect(formatTopics(input)).toEqual(output);
  });
  test("formatTopics: when you pass object it returns array of slug and description ", () => {
    const input = [ {
        description: "The man, the Mitch, the legend",
        slug: "mitch",
      }]
    const output = [ [ 'mitch', 'The man, the Mitch, the legend' ] ];
    expect(formatTopics(input)).toEqual(output);
  });
  test("formatTopics: when you pass topicData it returns array of slug and description ", () => {
    const input = topicData
    const output =  [
      [ 'mitch', 'The man, the Mitch, the legend' ],
      [ 'cats', 'Not dogs' ],
      [ 'paper', 'what books are made of'  ]
    ];
    expect(formatTopics(input)).toEqual(output);
  });
  test("formatTopics: does not mutate the original input", () => {
    const data = [ {
      description: "The man, the Mitch, the legend",
      slug: "mitch",
    }]
    const data2 = [ {
      description: "The man, the Mitch, the legend",
      slug: "mitch",
    }]
    formatTopics(data)
    expect(data).toEqual(data2);
  });
});
