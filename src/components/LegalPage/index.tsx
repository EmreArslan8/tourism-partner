import type { LegalDoc } from "@/lib/legal-content";
import styles from "./styles";

/* Hukuki doküman sayfası — başlık + tarih + bölümler. İçerik lib/legal-content.ts'ten gelir. */
const LegalPage = ({ doc }: { doc: LegalDoc }) => (
  <main className={styles.main}>
    <article className={styles.article}>
      <header>
        <h1 className={styles.title}>{doc.title}</h1>
        <p className={styles.updated}>{doc.updated}</p>
        <p className={styles.intro}>{doc.intro}</p>
      </header>
      {doc.sections.map((section) => (
        <section key={section.heading}>
          <h2 className={styles.heading}>{section.heading}</h2>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 40)} className={styles.paragraph}>{paragraph}</p>
          ))}
        </section>
      ))}
    </article>
  </main>
);

export default LegalPage;
