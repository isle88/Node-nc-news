const { topicData } = require('../db/data/test-data');

exports.formatTopics = (data) => {
  const cloneData = [...data];
  const topics = cloneData.map((topic) => [topic.slug, topic.description]);

  return topics;
};
