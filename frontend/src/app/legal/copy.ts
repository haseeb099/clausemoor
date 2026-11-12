/** In-app copies of docs/legal. Keep the two in step when a solicitor revises them. */

export const LEGAL_BANNER =
    "TEMPLATE. Have a UK solicitor review this before you accept customers or take payment. This is not legal advice.";

export const TERMS_TEXT = `Terms of Service

${LEGAL_BANNER}

[Operator legal name] provides Clausemoor, a legal AI workspace. Replace the placeholders in docs/legal/terms.md and publish the reviewed text. Until then, this page shows the same starting point.

1. Who we are. [Operator legal name], [address], company number [number], contact [support email]. Clausemoor is software. It is not a law firm and does not create a solicitor-client relationship with the operator.

2. The service is sold as a hosted subscription or as a self-hosted install with a support contract. The order form states which one, the fees, and the term.

3. You keep credentials confidential, authorise each user, and do not use the service unlawfully or to break into it.

4. You own your documents, prompts, and outputs. On the hosted service you instruct the operator to process them only to provide the service. On a self-hosted install that data stays on your servers.

5. AI output can be wrong. A qualified lawyer must review it before it is relied on, sent, or filed.

6. Fees are in the order form, in pounds sterling and exclusive of VAT unless the form says otherwise. Published list prices are indicative; the signed order form controls. Sales are on invoice. This build does not take card payments inside the app.

7. Each party keeps the other's non-public information confidential.

8. Access may be suspended for unpaid fees, security risk, or a legal duty. A material breach that is not fixed within 30 days of notice can end the contract. Hosted customers can export data for the period in the order form.

9. Nothing limits liability that English law does not allow to be limited. Other liability is capped at the fees paid or payable for the contract year, and excludes indirect loss.

10. The law of England and Wales applies, and the courts of England and Wales have exclusive jurisdiction, except for an application for an injunction.

Clausemoor is based on the open-source Mike project by Open Legal Products, Inc., licensed under AGPL-3.0.`;

export const PRIVACY_TEXT = `Privacy Policy

${LEGAL_BANNER}

This starting point is for a UK operator under the UK GDPR and the Data Protection Act 2018. The full placeholder is docs/legal/privacy.md.

[Operator legal name] is the controller for account, billing, and support personal data. A law firm using hosted Clausemoor is the controller of personal data inside matters. The operator processes that data as the firm's processor under the Data Processing Addendum. A self-hosted customer keeps matter data on their own systems.

We collect account details, billing contacts, support messages, and, on the hosted service, the documents and chats you submit. Error monitoring is off unless the operator sets their own Sentry DSN.

We use this data to perform the contract, to meet legal duties such as tax records, and for security as a legitimate interest. We keep invoices for the period the law requires and delete hosted customer data after the export window at the end of the contract, except required retention and expiring backups.

We use subprocessors for hosting, database, storage, email, and the language-model providers the deployment enables. Name them before launch. International transfers use a UK transfer tool such as the IDTA or the UK Addendum, and the EU SCCs where an EEA transfer requires them.

People can ask for access, correction, deletion, restriction, and portability, and can complain to the Information Commissioner's Office. The app uses cookies needed to keep you signed in. Do not add analytics until this policy describes them.`;

export const DPA_TEXT = `Data Processing Addendum

${LEGAL_BANNER}

This addendum is for the hosted service, where the customer is the controller and [Operator legal name] is the processor. It is not the document for a self-hosted install where the operator does not process matter data. The full placeholder is docs/legal/dpa.md.

The processor processes personal data in customer documents and chats only to provide the hosted service, and on the customer's documented instructions, unless the law requires otherwise.

Processing covers the subscription term. Data subjects are the customer's users and people named in uploaded documents. Categories are names, contact details, account identifiers, and document and chat contents. Special-category data is not requested.

The processor keeps security measures appropriate to the risk and will describe the real hosting region and access arrangements in the signed copy. Subprocessors for hosting, database, storage, email, and model inference are listed at [URL]. The customer gets notice before a new subprocessor is added.

Transfers outside the UK use a lawful UK transfer tool. People with access are under a confidentiality duty. The processor assists with data-subject requests and tells the customer without undue delay after becoming aware of a personal-data breach affecting customer data.

At the end of the service the customer may export data, and the processor then deletes it from the live service unless the law requires retention. The processor provides the information reasonably needed to show compliance.

If this addendum conflicts with the terms on a point of data protection, this addendum wins.`;
