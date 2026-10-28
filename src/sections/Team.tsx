import { team, type TeamMember } from '../content/team';
import { useActiveId } from '../hooks/useActiveId';
import { scrollStopProps } from '../shared/scrollStops';
import { ChipList } from '../ui/ChipList';
import { CrownIcon } from '../ui/CrownIcon';
import { SectionHeading } from '../ui/SectionHeading';

const memberIds = team.map((member) => member.id);

/**
 * The team journey. Each member gets a full-viewport stop; as it scrolls into view the camera
 * flies to that member's portal. Cards alternate sides so the portal is visible beside them.
 * Everything here is real HTML, so the team is fully presented even when the 3D never loads.
 */
export function Team() {
  const activeId = useActiveId(memberIds);

  return (
    <section id="team" aria-labelledby="team-heading" className="relative">
      <div className="px-6 pt-40 md:px-10">
        <SectionHeading
          id="team-heading"
          eyebrow="01 / Team"
          title="The people behind the work"
          intro="Scroll through the portals to meet the team, starting with our lead."
        />
      </div>
      <ol>
        {team.map((member, index) => (
          <li key={member.id}>
            <MemberStop member={member} index={index} />
          </li>
        ))}
      </ol>
      <TeamNav activeId={activeId} />
    </section>
  );
}

/** One member's full-viewport stop, with their HUD card on the left or right. */
function MemberStop({ member, index }: { member: TeamMember; index: number }) {
  const isLead = member.rank === 'lead';
  const alignEnd = index % 2 === 1;

  return (
    <article
      id={member.id}
      aria-labelledby={`${member.id}-name`}
      data-testid={`member-card-${member.id}`}
      className="flex min-h-svh items-center px-6 py-24 md:px-10"
      {...scrollStopProps}
    >
      <div className={`flex w-full ${alignEnd ? 'md:justify-end' : ''}`}>
        <div
          data-reveal
          className={`hud-frame grid w-full max-w-xl gap-7 border bg-space-raised/85 p-7 sm:grid-cols-[11rem_1fr] ${
            isLead
              ? 'border-gold/40 shadow-[0_0_80px_-30px] shadow-gold/50 [--hud:var(--color-gold)]'
              : 'border-line'
          }`}
        >
          <div className="relative overflow-hidden">
            <img
              src={`/images/team/${member.id}.webp`}
              width={member.photo.width}
              height={member.photo.height}
              alt={`Portrait of ${member.name}`}
              loading="lazy"
              decoding="async"
              className="aspect-3/4 w-full object-cover sm:w-44"
            />
            {/* A tint ties the monochrome portraits into the palette. */}
            <span
              aria-hidden="true"
              className={`absolute inset-0 mix-blend-soft-light ${isLead ? 'bg-gold/30' : 'bg-accent-cool/30'}`}
            />
          </div>
          <div className="flex flex-col gap-4">
            <p
              className={`label-mono flex items-center gap-3 ${isLead ? 'text-gold' : 'text-accent-cool'}`}
            >
              {isLead && <CrownIcon className="h-5 w-5" />}[{String(index + 1).padStart(2, '0')}]{' '}
              {member.title}
            </p>
            <h3
              id={`${member.id}-name`}
              className="font-display text-4xl font-medium tracking-tight"
            >
              {member.name}
            </h3>
            <p className="text-ink-muted">{member.bio}</p>
            <ChipList label={`${member.name}'s skills`} items={member.skills} />
          </div>
        </div>
      </div>
    </article>
  );
}

/**
 * Indexed dot navigator fixed at the right edge while a member is on screen. Plain anchors, so
 * it works without JavaScript; `invisible` (not just transparent) removes it from the tab order
 * and the accessibility tree while hidden.
 */
function TeamNav({ activeId }: { activeId: string | null }) {
  return (
    <nav
      aria-label="Team members"
      className={`fixed top-1/2 right-6 z-20 hidden -translate-y-1/2 transition-opacity duration-500 md:block ${
        activeId ? 'opacity-100' : 'invisible opacity-0'
      }`}
    >
      <ol className="flex flex-col gap-3">
        {team.map((member, index) => {
          const isActive = member.id === activeId;
          const dotColour = member.rank === 'lead' ? 'bg-gold' : 'bg-accent-cool';
          return (
            <li key={member.id}>
              <a
                href={`#${member.id}`}
                aria-label={`Go to ${member.name}`}
                aria-current={isActive ? 'step' : undefined}
                data-testid={`team-nav-${member.id}`}
                className="group flex items-center justify-end gap-3 p-1"
              >
                <span
                  className={`label-mono transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 ${
                    isActive ? 'text-ink opacity-100' : 'text-ink-muted opacity-0'
                  }`}
                >
                  {String(index + 1).padStart(2, '0')} {member.name}
                </span>
                <span
                  aria-hidden="true"
                  className={`block rounded-full transition-all duration-500 ${dotColour} ${
                    isActive ? 'h-3 w-3 shadow-[0_0_12px] shadow-current' : 'h-1.5 w-1.5 opacity-50'
                  }`}
                />
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
