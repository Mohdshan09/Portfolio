import { SectionHeader } from '../ui/SectionHeader';
import { formatMonthYear } from '../../lib/date';
import type { Certificate, EducationEntry } from '../../content/types';

interface CertificatesEducationProps {
  certificates: Certificate[];
  education: EducationEntry[];
}

export function CertificatesEducation({ certificates, education }: CertificatesEducationProps) {
  return (
    <section className="border-b-2 border-line">
      <div className="mx-auto max-w-[1360px] px-4 py-16 sm:px-6 sm:py-24">
        <SectionHeader index="05" command="$ cat credentials.txt">
          Certificates &amp; <em>Education</em>
        </SectionHeader>

        <div className="grid gap-12 sm:grid-cols-2">
          <div>
            <h3 className="mb-4 font-mono text-meta text-ink-mute">CERTIFICATES</h3>
            <ul className="divide-y divide-line-soft border-t border-line-soft">
              {certificates.map((cert) => (
                <li key={cert.title} className="flex items-baseline justify-between gap-4 py-3">
                  <div>
                    {cert.credentialUrl ? (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-ink hover:text-acid-hover hover:underline"
                      >
                        {cert.title}
                      </a>
                    ) : (
                      <span className="text-ink">{cert.title}</span>
                    )}
                    <div className="font-mono text-meta text-ink-mute">{cert.issuer}</div>
                  </div>
                  <span className="whitespace-nowrap font-mono text-meta text-ink-mute">
                    {formatMonthYear(cert.date)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-mono text-meta text-ink-mute">EDUCATION</h3>
            <ul className="divide-y divide-line-soft border-t border-line-soft">
              {education.map((entry) => (
                <li key={entry.institution} className="py-3">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-ink">{entry.institution}</span>
                    <span className="whitespace-nowrap font-mono text-meta text-ink-mute">
                      {entry.startYear}–{entry.endYear}
                    </span>
                  </div>
                  <div className="font-mono text-meta text-ink-mute">
                    {entry.degree}
                    {entry.score ? ` · ${entry.score}` : ''}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
