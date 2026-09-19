import WhatsAppLink from "./WhatsAppLink";

const coordinators = [
  { name: "Santhosh Kumar", phone: "+919345890184", display: "+91 93458 90184" },
  { name: "Ragul Prasath V", phone: "+919345690254", display: "+91 93456 90254" },
];

const CoordinatorInfo = () => (
  <div className="mt-6 border-t-2 border-dashed border-line pt-5 text-sm text-ink">
    <p className="eyebrow text-ink-2">For further details, contact</p>
    <ul className="mt-3 grid gap-3 sm:grid-cols-2">
      {coordinators.map(({ name, phone, display }) => (
        <li key={phone} className="border-2 border-ink bg-wcard p-3 text-left">
          <p>
            <span className="font-bold">{name}</span>{" "}
            <span className="text-ink-2">- Coordinator</span>
          </p>
          <WhatsAppLink
            phone={phone}
            className="mt-1 inline-block"
            message="Hello, I have a query regarding my accommodation."
          >
            {display}
          </WhatsAppLink>
        </li>
      ))}
    </ul>
  </div>
);

export default CoordinatorInfo;
