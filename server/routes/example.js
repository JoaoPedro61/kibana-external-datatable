export default function(server) {
  server.route({
    path: '/api/kbn_bst_tbl/example',
    method: 'GET',
    handler() {
      return { time: new Date().toISOString() };
    },
  });
}
