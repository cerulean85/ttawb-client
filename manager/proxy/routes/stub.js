// const stub = require("./routes/stub");
const protoLoader = require("@grpc/proto-loader");
const grpc = require("@grpc/grpc-js");
const config = require("../config");
const stub = require("../routes/query");
const {NULL} = require("mysql/lib/protocol/constants/types");
const proto_path = "./proto/WorkProtocolService.proto"
const packageDefinition = protoLoader.loadSync(
    proto_path,
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });


const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const kkennibGrpc = protoDescriptor.com.kkennib.grpc;
// const grpc_aggregator_stub = new kkennibGrpc.WorkProtocolService(`localhost:${config.grpc_aggregator_port}`, grpc.credentials.createInsecure());
const grpc_collector_stub = new kkennibGrpc.WorkProtocolService(`localhost:${config.grpc_collector_port}`, grpc.credentials.createInsecure());


function echo() {
    console.log("ECHO")
}



module.exports = {

    stub: grpc_collector_stub,
    existReponsedResult: function (res, err) {

        if (err !== null) {
            console.log(err);
            return false
        }

        if (res !== undefined) {
            console.log(res);
            return true
        }
        return false
    }

}