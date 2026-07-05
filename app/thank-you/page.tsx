import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ThankYouPage() {
  return (
    <main className="thank-you">
      <div className="thank-you-box">
        <p className="eyebrow">Inquiry Received</p>
        <h1>Thank you for your inquiry.</h1>
        <p>
          Your message has been received and sent for further process. We will contact you soon.
        </p>
        <Link className="btn btn-primary" href="/">
          <ArrowLeft size={18} /> Back to Property
        </Link>
        <div style={{ marginTop: 28 }}>
          <CheckCircle2 size={42} color="#d8ad58" aria-hidden="true" />
        </div>
      </div>
    </main>
  );
}
