import Link from 'next/link';
import MobileWrapper from '@/components/layout/MobileWrapper';
import BottomNav from '@/components/layout/BottomNav';
import { notFound } from 'next/navigation';

// Mock info content
const infoContent: Record<string, { title: string; content: string }> = {
  'bin-collection': {
    title: 'Bin Collection Days',
    content: `## Whitstable Bin Collection Schedule

### Your collection days
Most Whitstable addresses are collected on **Tuesdays**.

### What bins go out when?

**Week A (Green Lid)**
- General waste
- Food waste

**Week B (Blue Lid)**
- Recycling (paper, cardboard, plastics, cans, glass)
- Food waste

### Check your collection day
Visit the Canterbury City Council website to enter your postcode and find your exact collection schedule.

### Missed collection?
Report a missed collection online within 48 hours of your scheduled collection day.

### Large item collection
Book a bulky waste collection for furniture and large items through the council website. Charges apply.

### Christmas schedule
Collections may change during the festive period. Check the council website in December for updated times.`,
  },
  'tide-times': {
    title: 'Tide Times',
    content: `## Whitstable Tide Times

The tides at Whitstable typically follow a semi-diurnal pattern with two high tides and two low tides each day.

### Today's Tides
- High tide: **3:45pm** (4.8m)
- Low tide: **9:20pm** (1.2m)

### Tomorrow
- High tide: **4:30am** (4.6m)
- Low tide: **10:15am** (1.4m)
- High tide: **4:45pm** (4.9m)

### Swimming safety
- Best swimming at high tide +/- 2 hours
- Avoid swimming at low tide due to exposed mudflats
- Check for red flags indicating no swimming

### For oyster foraging
Low tide is best for exploring the oyster beds. Always check tide times before heading out.

### Spring vs Neap tides
- **Spring tides** (around full/new moon): Higher highs, lower lows
- **Neap tides** (quarter moons): More moderate tidal range

*Times shown are for Whitstable Harbour. Add approximately 10 minutes for Tankerton.*`,
  },
  'oyster-festival': {
    title: 'Oyster Festival',
    content: `## Whitstable Oyster Festival

The Whitstable Oyster Festival is an annual celebration of the town's maritime heritage and famous native oysters.

### 2025 Festival Dates
**Saturday 26th - Sunday 27th July 2025**

### Main Events
- **Oyster Parade** - Saturday 10am from Harbour Street
- **Blessing of the Waters** - Saturday 11am at the harbour
- **Oyster Eating Competition** - Saturday 2pm
- **Live music** - Both days across multiple stages
- **Fireworks** - Saturday 10pm

### What to expect
- Street food from local vendors
- Local craft stalls
- Live music and entertainment
- Children's activities
- Beer tent and local ales

### Road closures
Harbour Street and surrounding areas will be closed to traffic during the festival. Use the park and ride from the rugby club.

### Getting there
- **Park & Ride**: Free shuttle from Whitstable Rugby Club
- **Train**: Regular services from London Victoria (90 mins)
- **Parking**: Very limited - please use public transport

### Volunteer
We're always looking for volunteers! Contact the festival committee through the Visit Whitstable website.`,
  },
  'parking': {
    title: 'Parking',
    content: `## Parking in Whitstable

### Main Car Parks

**Gorrell Tank (Long Stay)**
- Location: Gorrell Tank, CT5 2BP
- Spaces: ~200
- Rate: £1.50/hour, max £8/day
- Open 24 hours

**Harbour Street (Short Stay)**
- Location: Harbour Street, CT5 1AB
- Spaces: ~50
- Rate: £2/hour, max 3 hours
- Busy on weekends

**Stream Walk (Medium Stay)**
- Location: Stream Walk, CT5 1AW
- Spaces: ~100
- Rate: £1.50/hour, max £6/day

### Beach Car Parks

**Tankerton Slopes**
- Location: Marine Parade, CT5 2BE
- Seasonal rates apply
- Popular in summer - arrive early

**Long Beach**
- Pay & display
- Can flood at high tide - check notices

### Tips
- Download the **RingGo** app for easy payment
- Most car parks fill by 10am on sunny weekends
- Consider the **Park & Ride** during festivals
- **Blue badge holders**: Free parking in all council car parks

### Resident Permits
Apply through Canterbury City Council for annual resident parking permits for zone-restricted streets.`,
  },
  'beach-info': {
    title: 'Beach Info',
    content: `## Whitstable Beach Information

### Beach Areas

**West Beach**
- Pebble/shingle beach
- Good for swimming at high tide
- Popular with families
- Cafes and shops nearby

**Tankerton Beach**
- Longer stretch of pebble beach
- The famous "Street" - a shingle spit visible at low tide
- Slopes beach huts area
- Quieter than West Beach

**Long Beach (towards Seasalter)**
- More secluded
- Dog-friendly year-round
- Good for walks

### Facilities
- Public toilets at West Beach and Tankerton Slopes
- Beach huts available for hire (book well in advance)
- RNLI lifeguards in summer (check flags)

### Safety
🚩 **Red flag**: No swimming
🚩 **Yellow flag**: Caution
🏁 **Checkered flag**: Safe swimming area

### Dogs on beaches
- Dogs allowed all year at Long Beach
- Seasonal restrictions on West Beach and Tankerton (May-September)
- Always clean up after your dog

### Water quality
Whitstable's beaches regularly achieve "Excellent" water quality ratings. Check the Environment Agency website for current status.`,
  },
  'emergency-contacts': {
    title: 'Emergency Contacts',
    content: `## Emergency Contacts

### Emergency Services
**Police, Fire, Ambulance**: 999
**Non-emergency Police**: 101
**NHS non-emergency**: 111

### Local Services

**Whitstable Police Station**
25 High Street, CT5 1AP
Non-emergency: 101

**Nearest A&E**
Kent & Canterbury Hospital
Ethelbert Road, Canterbury CT1 3NG
01227 766877

**Minor Injuries Unit**
Herne Bay and Whitstable Minor Injuries Unit
15-minute drive

### Useful Numbers

**Coast Guard**: 999 (ask for Coast Guard)
**Whitstable Lifeboat Station**: 01227 262166
**Canterbury City Council**: 01227 862000
**Environment Agency (flooding)**: 0800 80 70 60
**National Grid (gas emergency)**: 0800 111 999
**UK Power Networks**: 0800 31 63 105

### Local Medical

**Whitstable Medical Practice**
Harbour Street, CT5 1AJ
01227 594400

**Out of hours**: Call 111

### Vets

**Westgate Veterinary Surgery**
01227 273223`,
  },
  'council-contacts': {
    title: 'Council Contacts',
    content: `## Canterbury City Council

### Main Contact
**Phone**: 01227 862000
**Email**: info@canterbury.gov.uk
**Address**: Council Offices, Military Road, Canterbury CT1 1YW

### Online Services
Most services can be accessed through the council website:
- Report issues (fly-tipping, potholes, etc.)
- Pay council tax
- Apply for permits
- Check planning applications

### Useful Departments

**Council Tax**
01227 862056

**Housing**
01227 862030

**Planning**
01227 862178

**Environmental Health**
01227 862100

**Parking Services**
01227 862545

### Local Councillors
Your local councillors for Whitstable can be contacted through the council website. Enter your postcode to find your representatives.

### Reporting Issues
- **Fly-tipping**: Report online or call 01227 862000
- **Potholes**: Report through Kent County Council
- **Streetlights**: Kent County Council - 03000 41 81 81
- **Noise complaints**: Environmental Health`,
  },
  'school-term-dates': {
    title: 'School Term Dates',
    content: `## School Term Dates 2024-2025

### Kent County Council Schools

**Autumn Term 2024**
- Start: Tuesday 3 September 2024
- Half term: 28 October - 1 November 2024
- End: Friday 20 December 2024

**Spring Term 2025**
- Start: Monday 6 January 2025
- Half term: 17-21 February 2025
- End: Friday 4 April 2025

**Summer Term 2025**
- Start: Tuesday 22 April 2025
- Half term: 26-30 May 2025
- End: Tuesday 22 July 2025

### INSET Days
Each school sets their own INSET (teacher training) days. Check with your individual school for these dates.

### Local Schools
- **Whitstable Junior School**
- **Joy Lane Primary School**
- **Swalecliffe Community Primary**
- **Simon Langton Grammar Schools** (Canterbury)
- **The Whitstable School**

*Note: Some schools may have slightly different term dates. Always confirm with your school directly.*`,
  },
  'healthcare': {
    title: 'Doctors / Dentist / Vet',
    content: `## Healthcare in Whitstable

### GP Surgeries

**Whitstable Medical Practice**
Harbour Street, CT5 1AJ
01227 594400
*Accepting new patients - check NHS website*

**Estuary View Medical Centre**
Boorman Way, CT5 3SE
01227 284100

### Dentists

**Whitstable Dental Practice**
39 High Street, CT5 1AP
01227 273322

**Coast Dental**
Oxford Street, CT5 1DB
01227 262280

*Finding an NHS dentist can be difficult. Use NHS Find a Dentist tool or call 111.*

### Pharmacies

**Boots Pharmacy**
41 High Street
01227 273414

**Lloyds Pharmacy**
24 Oxford Street
01227 262888

### Vets

**Westgate Veterinary Surgery**
7 Station Road, CT5 1QT
01227 273223
*24-hour emergency service*

**Companion Care Vets** (inside Pets at Home)
Thanet Way Retail Park
01227 771174

### Opticians

**Specsavers**
38 High Street
01227 264955

**Blacks Opticians**
12 Oxford Street
01227 273880`,
  },
  'carnival': {
    title: 'Carnival',
    content: `## Whitstable Carnival

The Whitstable Carnival is a traditional summer celebration held annually in August.

### 2025 Carnival
**Date**: Saturday 9th August 2025 (TBC)

### Events
- **Carnival Procession**: Starting from Tankerton, ending at the harbour
- **Float competition**: Enter your community group!
- **Fancy dress**: Categories for all ages
- **Live entertainment**: Music, dancing, performers
- **Beach activities**: Sandcastle competition, games

### Getting Involved
- **Enter a float**: Contact the carnival committee by June
- **Volunteer marshals needed**: Help keep the procession safe
- **Sponsor the event**: Business sponsorship opportunities

### Road Closures
The carnival route (Tankerton Road, Oxford Street, Harbour Street) will be closed from 11am-5pm on carnival day.

### History
The Whitstable Carnival has been running since the 1930s, celebrating community spirit and seaside fun.`,
  },
};

interface InfoPageProps {
  params: Promise<{ slug: string }>;
}

export default async function InfoDetailPage({ params }: InfoPageProps) {
  const { slug } = await params;
  const info = infoContent[slug];

  if (!info) {
    notFound();
  }

  // Simple markdown-like rendering
  const renderContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('## ')) {
        return <h2 key={i} className="text-xl font-bold text-ink mt-6 mb-3">{line.slice(3)}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={i} className="text-lg font-semibold text-ink mt-4 mb-2">{line.slice(4)}</h3>;
      }
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={i} className="font-semibold text-ink">{line.slice(2, -2)}</p>;
      }
      if (line.startsWith('- ')) {
        return <li key={i} className="ml-4 text-grey-dark">{line.slice(2)}</li>;
      }
      if (line.startsWith('*') && line.endsWith('*')) {
        return <p key={i} className="italic text-grey text-sm mt-4">{line.slice(1, -1)}</p>;
      }
      if (line.trim() === '') {
        return <br key={i} />;
      }
      return <p key={i} className="text-grey-dark">{line}</p>;
    });
  };

  return (
    <MobileWrapper>
      {/* Header */}
      <div className="bg-sky px-4 py-4">
        <div className="flex items-center gap-3">
          <Link href="/info" className="text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-white font-bold text-xl">{info.title.toLowerCase()}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        <div className="prose prose-sm max-w-none">
          {renderContent(info.content)}
        </div>
      </div>

      <BottomNav />
    </MobileWrapper>
  );
}

export async function generateStaticParams() {
  return Object.keys(infoContent).map((slug) => ({ slug }));
}
