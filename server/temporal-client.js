const { Client } = require("@temporalio/client");

let client;

async function getClient() {
  if (!client) {
    client = new Client({
      connection: {
        address: process.env.TEMPORAL_SERVER_URL || "localhost:7233",
      },
    });
  }
  return client;
}

module.exports = {
  async startWorkflow(options) {
    const client = await getClient();
    const handle = await client.workflow.start(options);
    return handle;
  },
};
