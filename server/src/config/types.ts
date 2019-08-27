const TYPES = {
    string: Symbol.for("String"),

    S3: Symbol.for("S3"),
    S3Interface: Symbol.for("S3Interface"),

    DDB: Symbol.for("DynamoDB"),
    DDBProxy: Symbol.for("DynamoDbInterface"),

    UploadResumeHandler: Symbol.for("UploadResumeHandler"),
    SignUpHandler: Symbol.for("SignUpHandler"),
    ResumeLinkRequestHandler: Symbol.for("ResumeLinkRequestHandler"),
    RemoveResumeHandler: Symbol.for("RemoveResumeHandler"),
    KeyGen: Symbol.for("KeyGen")
};

export { TYPES };