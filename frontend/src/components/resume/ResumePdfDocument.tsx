import { Document, Page, Text, View, Image } from '@react-pdf/renderer'
import { styles, getSkillLevel, getLanguageFluency } from './ResumeStyles'
import type { ResumeData } from './ResumeTypes'

export interface ResumePdfDocumentProps {
  resumeData: ResumeData
}

export const ResumePdfDocument = ({ resumeData }: ResumePdfDocumentProps) => {
  const { 
    basics, 
    work = [], 
    volunteer = [], 
    education = [], 
    skills = [], 
    languages = [], 
    references = [], 
    interests = [],
    awards = [],
    certificates = [],
    publications = [],
    projects = []
  } = resumeData

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Left Sidebar */}
        <View style={styles.sidebar}>
          {/* Portrait */}
          {basics?.image && (
            <View style={styles.sidebarSection}>
              <Image src={basics.image} style={styles.portrait} />
            </View>
          )}

          {/* About Me */}
          {basics?.summary && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarHeading}>About Me</Text>
              <Text style={styles.sidebarText}>{basics.summary}</Text>
            </View>
          )}

          {/* Links */}
          {basics?.profiles && basics.profiles.length > 0 && (
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
                </View>
              ))}
            </View>
          )}

          {/* Interests/Hobbies */}
          {interests.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarHeading}>Interests</Text>
              {interests.map((interest, index) => (
                <View key={index} style={styles.bulletItem}>
                  <Text style={styles.hobbyBullet}>•</Text>
                  <Text style={styles.hobbyItem}>{interest.name}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Awards */}
          {awards.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarHeading}>Awards</Text>
              {awards.map((award, index) => (
                <View key={index} style={styles.referenceItem}>
                  <Text style={styles.sidebarTextBold}>{award.title}</Text>
                  {award.awarder && (
                    <Text style={styles.sidebarText}>by {award.awarder}</Text>
                  )}
                  {award.date && (
                    <Text style={styles.sidebarText}>{award.date}</Text>
                  )}
                  {award.summary && (
                    <Text style={styles.sidebarText}>{award.summary}</Text>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Right Main Content */}
        <View style={styles.mainContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.name}>{basics?.name || ''}</Text>
            {basics?.label && (
              <Text style={styles.jobTitle}>{basics.label}</Text>
            )}

            <View style={styles.contactInfo}>
              {basics?.location && (
                <View style={styles.contactItem}>
                  <Text style={styles.contactText}>
                    {[
                      basics.location.address,
                      basics.location.city,
                      basics.location.region,
                      basics.location.postalCode,
                      basics.location.countryCode
                    ].filter(Boolean).join(', ')}
                  </Text>
                </View>
              )}
              {basics?.phone && (
                <View style={styles.contactItem}>
                  <Text style={styles.contactText}>{basics.phone}</Text>
                </View>
              )}
              {basics?.email && (
                <View style={styles.contactItem}>
                  <Text style={styles.contactText}>{basics.email}</Text>
                </View>
              )}
              {basics?.url && (
                <View style={styles.contactItem}>
                  <Text style={styles.contactText}>{basics.url}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Work Experience */}
          {work.length > 0 && (
            <View style={styles.section} wrap={false}>
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
                        <Text style={styles.itemTitle}>{job.name || 'Company'}</Text>
                        <Text style={styles.itemDate}>
                          {job.startDate || ''} - {job.endDate || 'Present'}
                        </Text>
                      </View>
                      {job.position && (
                        <Text style={styles.itemSubtitle}>{job.position}</Text>
                      )}
                      {job.url && (
                        <Text style={styles.itemLocation}>{job.url}</Text>
                      )}
                      {job.summary && (
                        <Text style={styles.bulletText}>{job.summary}</Text>
                      )}

                      {job.highlights && job.highlights.length > 0 && (
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

          {/* Volunteer Experience */}
          {volunteer.length > 0 && (
            <View style={styles.section} wrap={false}>
              <Text style={styles.sectionHeading}>Volunteer Experience</Text>
              <View style={styles.timelineContainer}>
                {volunteer.map((vol, index) => (
                  <View key={index} style={styles.timelineItem}>
                    <View style={styles.timelineMarker}>
                      <View style={styles.timelineDot} />
                      {index < volunteer.length - 1 && (
                        <View style={styles.timelineLine} />
                      )}
                    </View>
                    <View style={styles.timelineContent}>
                      <View style={styles.itemHeader}>
                        <Text style={styles.itemTitle}>{vol.organization || 'Organization'}</Text>
                        <Text style={styles.itemDate}>
                          {vol.startDate || ''} - {vol.endDate || 'Present'}
                        </Text>
                      </View>
                      {vol.position && (
                        <Text style={styles.itemSubtitle}>{vol.position}</Text>
                      )}
                      {vol.url && (
                        <Text style={styles.itemLocation}>{vol.url}</Text>
                      )}
                      {vol.summary && (
                        <Text style={styles.bulletText}>{vol.summary}</Text>
                      )}

                      {vol.highlights && vol.highlights.length > 0 && (
                        <View style={styles.bulletList}>
                          {vol.highlights.map((highlight, hIndex) => (
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

          {/* Projects */}
          {projects.length > 0 && (
            <View style={styles.section} wrap={false}>
              <Text style={styles.sectionHeading}>Projects</Text>
              <View style={styles.timelineContainer}>
                {projects.map((project, index) => (
                  <View key={index} style={styles.timelineItem}>
                    <View style={styles.timelineMarker}>
                      <View style={styles.timelineDot} />
                      {index < projects.length - 1 && (
                        <View style={styles.timelineLine} />
                      )}
                    </View>
                    <View style={styles.timelineContent}>
                      <View style={styles.itemHeader}>
                        <Text style={styles.itemTitle}>{project.name || 'Project'}</Text>
                        <Text style={styles.itemDate}>
                          {project.startDate || ''} - {project.endDate || 'Present'}
                        </Text>
                      </View>
                      {project.url && (
                        <Text style={styles.itemLocation}>{project.url}</Text>
                      )}
                      {project.description && (
                        <Text style={styles.bulletText}>{project.description}</Text>
                      )}

                      {project.highlights && project.highlights.length > 0 && (
                        <View style={styles.bulletList}>
                          {project.highlights.map((highlight, hIndex) => (
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
            <View style={styles.section} wrap={false}>
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
                        <Text style={styles.itemTitle}>{edu.institution || 'Institution'}</Text>
                        <Text style={styles.itemDate}>
                          {edu.startDate || ''} - {edu.endDate || ''}
                        </Text>
                      </View>
                      {edu.area && (
                        <Text style={styles.itemSubtitle}>{edu.area}</Text>
                      )}
                      {edu.studyType && (
                        <Text style={styles.itemLocation}>{edu.studyType}</Text>
                      )}
                      {edu.score && (
                        <Text style={styles.itemLocation}>Score: {edu.score}</Text>
                      )}
                      {edu.url && (
                        <Text style={styles.itemLocation}>{edu.url}</Text>
                      )}

                      {edu.courses && edu.courses.length > 0 && (
                        <View style={styles.bulletList}>
                          {edu.courses.map((course, cIndex) => (
                            <View key={cIndex} style={styles.bulletItem}>
                              <Text style={styles.bulletPoint}>•</Text>
                              <Text style={styles.bulletText}>{course}</Text>
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

          {/* Publications */}
          {publications.length > 0 && (
            <View style={styles.section} wrap={false}>
              <Text style={styles.sectionHeading}>Publications</Text>
              <View style={styles.timelineContainer}>
                {publications.map((pub, index) => (
                  <View key={index} style={styles.timelineItem}>
                    <View style={styles.timelineMarker}>
                      <View style={styles.timelineDot} />
                      {index < publications.length - 1 && (
                        <View style={styles.timelineLine} />
                      )}
                    </View>
                    <View style={styles.timelineContent}>
                      <View style={styles.itemHeader}>
                        <Text style={styles.itemTitle}>{pub.name || 'Publication'}</Text>
                        <Text style={styles.itemDate}>{pub.releaseDate || ''}</Text>
                      </View>
                      {pub.publisher && (
                        <Text style={styles.itemSubtitle}>{pub.publisher}</Text>
                      )}
                      {pub.url && (
                        <Text style={styles.itemLocation}>{pub.url}</Text>
                      )}
                      {pub.summary && (
                        <Text style={styles.bulletText}>{pub.summary}</Text>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Certificates */}
          {certificates.length > 0 && (
            <View style={styles.section} wrap={false}>
              <Text style={styles.sectionHeading}>Certificates</Text>
              <View style={styles.timelineContainer}>
                {certificates.map((cert, index) => (
                  <View key={index} style={styles.timelineItem}>
                    <View style={styles.timelineMarker}>
                      <View style={styles.timelineDot} />
                      {index < certificates.length - 1 && (
                        <View style={styles.timelineLine} />
                      )}
                    </View>
                    <View style={styles.timelineContent}>
                      <View style={styles.itemHeader}>
                        <Text style={styles.itemTitle}>{cert.name || 'Certificate'}</Text>
                        <Text style={styles.itemDate}>{cert.date || ''}</Text>
                      </View>
                      {cert.issuer && (
                        <Text style={styles.itemSubtitle}>{cert.issuer}</Text>
                      )}
                      {cert.url && (
                        <Text style={styles.itemLocation}>{cert.url}</Text>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <View style={styles.section} wrap={false}>
              <Text style={styles.sectionHeading}>Skills</Text>
              <View style={styles.skillsGrid}>
                <View style={styles.skillColumn}>
                  {skills
                    .filter((_, index) => index % 2 === 0)
                    .map((skill, index) => (
                      <View key={index} style={styles.skillItem}>
                        <Text style={styles.skillName}>{skill.name || 'Skill'}</Text>
                        {skill.level && (
                          <View style={styles.skillBar}>
                            <View
                              style={[
                                styles.skillProgress,
                                { width: getSkillLevel(skill.level) },
                              ]}
                            />
                          </View>
                        )}
                        {skill.keywords && skill.keywords.length > 0 && (
                          <Text style={styles.sidebarText}>
                            {skill.keywords.join(', ')}
                          </Text>
                        )}
                      </View>
                    ))}
                </View>
                <View style={styles.skillColumn}>
                  {skills
                    .filter((_, index) => index % 2 === 1)
                    .map((skill, index) => (
                      <View key={index} style={styles.skillItem}>
                        <Text style={styles.skillName}>{skill.name || 'Skill'}</Text>
                        {skill.level && (
                          <View style={styles.skillBar}>
                            <View
                              style={[
                                styles.skillProgress,
                                { width: getSkillLevel(skill.level) },
                              ]}
                            />
                          </View>
                        )}
                        {skill.keywords && skill.keywords.length > 0 && (
                          <Text style={styles.sidebarText}>
                            {skill.keywords.join(', ')}
                          </Text>
                        )}
                      </View>
                    ))}
                </View>
              </View>
            </View>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <View style={styles.section} wrap={false}>
              <Text style={styles.sectionHeading}>Languages</Text>
              <View style={styles.languagesGrid}>
                <View style={styles.languageColumn}>
                  {languages
                    .filter((_, index) => index % 2 === 0)
                    .map((language, index) => (
                      <View key={index} style={styles.languageItem}>
                        <Text style={styles.languageName}>
                          {language.language || 'Language'}
                        </Text>
                        {language.fluency && (
                          <View style={styles.languageBar}>
                            <View
                              style={[
                                styles.languageProgress,
                                { width: getLanguageFluency(language.fluency) },
                              ]}
                            />
                          </View>
                        )}
                      </View>
                    ))}
                </View>
                <View style={styles.languageColumn}>
                  {languages
                    .filter((_, index) => index % 2 === 1)
                    .map((language, index) => (
                      <View key={index} style={styles.languageItem}>
                        <Text style={styles.languageName}>
                          {language.language || 'Language'}
                        </Text>
                        {language.fluency && (
                          <View style={styles.languageBar}>
                            <View
                              style={[
                                styles.languageProgress,
                                { width: getLanguageFluency(language.fluency) },
                              ]}
                            />
                          </View>
                        )}
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
