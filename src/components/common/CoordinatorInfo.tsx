import WhatsAppLink from "./WhatsAppLink";
const CoordinatorInfo = () => (
  <div className="mt-6 text-gray-400 text-sm text-center space-y-1">
    <p>
      For further details, contact: <br />
      <span className="font-semibold">Santhosh Kumar </span> - Coordinator{" "}
      <WhatsAppLink
        phone="+919345890184"
        className="text-[#80466E] ml-1"
        message="Hello, I have a query regarding my accommodation."
      >
        +91 93458 90184
      </WhatsAppLink>
      <br />
      <span className="font-semibold">Ragul Prasath V </span> - Coordinator{" "}
      <WhatsAppLink
        phone="+919345690254"
        className="text-[#80466E] ml-1"
        message="Hello, I have a query regarding my accommodation."
      >
        +91 93456 90254
      </WhatsAppLink>
    </p>
  </div>
);

export default CoordinatorInfo;
