import { Document, Page, Text, View, Image } from '@react-pdf/renderer'
import { styles, getSkillLevel, getLanguageFluency } from './ResumeStyles'
import type { ResumeData } from './ResumeTypes'

export interface ResumePdfDocumentProps {
  resumeData: ResumeData
}

export const ResumePdfDocument = ({ resumeData }: ResumePdfDocumentProps) => {
  const { basics, work, education, skills, languages, references, interests } =
    resumeData

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Left Sidebar */}
        <View style={styles.sidebar}>
          {/* Portrait */}
          {basics.image && (
            <View style={styles.sidebarSection}>
              <Image src={basics.image} style={styles.portrait} />
            </View>
          )}

          {/* About Me */}
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarHeading}>About Me</Text>
            <Text style={styles.sidebarText}>{basics.summary}</Text>
          </View>

          {/* Links */}
          {basics.profiles.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarHeading}>Links</Text>
              {basics.profiles.map((profile, index) => (
                <View key={index}>
                  <Text style={styles.sidebarTextBold}>{profile.network}:</Text>
                  <Text style={styles.link}>{profile.url}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Reference */}
          {references.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarHeading}>Reference</Text>
              {references.map((ref, index) => (
                <View key={index} style={styles.referenceItem}>
                  <Text style={styles.sidebarTextBold}>{ref.name}</Text>
                  {ref.reference && (
                    <Text style={styles.sidebarText}>{ref.reference}</Text>
                  )}
                  {ref.contact.phone && (
                    <Text style={styles.sidebarText}>
                      T: {ref.contact.phone}
                    </Text>
                  )}
                  {ref.contact.email && (
                    <Text style={styles.sidebarText}>
                      E: {ref.contact.email}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Hobbies */}
          {interests.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarHeading}>Hobbies</Text>
              {interests.map((interest, index) => (
                <View key={index} style={styles.bulletItem}>
                  <Text style={styles.hobbyBullet}>•</Text>
                  <Text style={styles.hobbyItem}>{interest.name}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Right Main Content */}
        <View style={styles.mainContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.name}>{basics.name}</Text>
            <Text style={styles.jobTitle}>{basics.label}</Text>

            <View style={styles.contactInfo}>
              <View style={styles.contactItem}>
                <Text style={styles.contactText}>
                  {basics.location.address}, {basics.location.city},{' '}
                  {basics.location.region}, {basics.location.postalCode},{' '}
                  {basics.location.countryCode}
                </Text>
              </View>
              <View style={styles.contactItem}>
                <Text style={styles.contactText}>{basics.phone}</Text>
              </View>
              <View style={styles.contactItem}>
                <Text style={styles.contactText}>{basics.email}</Text>
              </View>
            </View>
          </View>

          {/* Work Experience */}
          {work.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionHeading}>Work Experience</Text>
              <View style={styles.timelineContainer}>
                {work.map((job, index) => (
                  <View key={index} style={styles.timelineItem}>
                    <View style={styles.timelineMarker}>
                      <View style={styles.timelineDot} />
                      {index < work.length - 1 && (
                        <View style={styles.timelineLine} />
                      )}
                    </View>
                    <View style={styles.timelineContent}>
                      <View style={styles.itemHeader}>
                        <Text style={styles.itemTitle}>{job.name}</Text>
                        <Text style={styles.itemDate}>
                          {job.startDate} - {job.endDate || 'Present'}
                        </Text>
                      </View>
                      <Text style={styles.itemSubtitle}>{job.position}</Text>
                      <Text style={styles.itemLocation}>{job.location}</Text>

                      {job.highlights.length > 0 && (
                        <View style={styles.bulletList}>
                          {job.highlights.map((highlight, hIndex) => (
                            <View key={hIndex} style={styles.bulletItem}>
                              <Text style={styles.bulletPoint}>•</Text>
                              <Text style={styles.bulletText}>{highlight}</Text>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Education */}
          {education.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionHeading}>Education</Text>
              <View style={styles.timelineContainer}>
                {education.map((edu, index) => (
                  <View key={index} style={styles.timelineItem}>
                    <View style={styles.timelineMarker}>
                      <View style={styles.timelineDot} />
                      {index < education.length - 1 && (
                        <View style={styles.timelineLine} />
                      )}
                    </View>
                    <View style={styles.timelineContent}>
                      <View style={styles.itemHeader}>
                        <Text style={styles.itemTitle}>{edu.institution}</Text>
                        <Text style={styles.itemDate}>{edu.endDate}</Text>
                      </View>
                      <Text style={styles.itemSubtitle}>{edu.area}</Text>
                      <Text style={styles.itemLocation}>{edu.location}</Text>

                      {edu.highlights.length > 0 && (
                        <View style={styles.bulletList}>
                          {edu.highlights.map((highlight, hIndex) => (
                            <View key={hIndex} style={styles.bulletItem}>
                              <Text style={styles.bulletPoint}>•</Text>
                              <Text style={styles.bulletText}>{highlight}</Text>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionHeading}>Skills</Text>
              <View style={styles.skillsGrid}>
                <View style={styles.skillColumn}>
                  {skills
                    .filter((_, index) => index % 2 === 0)
                    .map((skill, index) => (
                      <View key={index} style={styles.skillItem}>
                        <Text style={styles.skillName}>{skill.name}</Text>
                        <View style={styles.skillBar}>
                          <View
                            style={[
                              styles.skillProgress,
                              { width: getSkillLevel(skill.level) },
                            ]}
                          />
                        </View>
                      </View>
                    ))}
                </View>
                <View style={styles.skillColumn}>
                  {skills
                    .filter((_, index) => index % 2 === 1)
                    .map((skill, index) => (
                      <View key={index} style={styles.skillItem}>
                        <Text style={styles.skillName}>{skill.name}</Text>
                        <View style={styles.skillBar}>
                          <View
                            style={[
                              styles.skillProgress,
                              { width: getSkillLevel(skill.level) },
                            ]}
                          />
                        </View>
                      </View>
                    ))}
                </View>
              </View>
            </View>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionHeading}>Languages</Text>
              <View style={styles.languagesGrid}>
                <View style={styles.languageColumn}>
                  {languages
                    .filter((_, index) => index % 2 === 0)
                    .map((language, index) => (
                      <View key={index} style={styles.languageItem}>
                        <Text style={styles.languageName}>
                          {language.language}
                        </Text>
                        <View style={styles.languageBar}>
                          <View
                            style={[
                              styles.languageProgress,
                              { width: getLanguageFluency(language.fluency) },
                            ]}
                          />
                        </View>
                      </View>
                    ))}
                </View>
                <View style={styles.languageColumn}>
                  {languages
                    .filter((_, index) => index % 2 === 1)
                    .map((language, index) => (
                      <View key={index} style={styles.languageItem}>
                        <Text style={styles.languageName}>
                          {language.language}
                        </Text>
                        <View style={styles.languageBar}>
                          <View
                            style={[
                              styles.languageProgress,
                              { width: getLanguageFluency(language.fluency) },
                            ]}
                          />
                        </View>
                      </View>
                    ))}
                </View>
              </View>
            </View>
          )}
        </View>
      </Page>
    </Document>
  )
}
