# TDD - Module 04: Activities

**Purpose:** Activity tracking (parent + daycare) dengan unified timeline

---

## 🔍 Queries

### **ChildActivities**

**Purpose:** Get activities for a child

**Variables:**
```json
{
  "childId": "65child123...",
  "date": "2026-02-23",
  "category": "MEAL"
}
```

**Query:**
```graphql
query GetChildActivities($childId: ObjectId!, $date: Date, $category: ActivityCategory) {
  childActivities(childId: $childId, date: $date, category: $category) {
    id
    activityName
    category
    date
    startTime
    endTime
    duration
    mealType
    menu
    eaten
    quality
    mood
    photos
    description
    source
    loggedBy {
      name
      relation
    }
  }
}
```

**Response:**
```json
{
  "data": {
    "childActivities": [
      {
        "id": "65activity123...",
        "activityName": "Makan Siang",
        "category": "MEAL",
        "date": "2026-02-23T00:00:00Z",
        "startTime": "11:00",
        "endTime": "11:45",
        "duration": 45,
        "mealType": "LUNCH",
        "menu": "Nasi, ayam, sayur",
        "eaten": "ALL",
        "mood": "HAPPY",
        "photos": ["https://example.com/photo.jpg"],
        "source": "PARENT",
        "loggedBy": {
          "name": "Ibu Budi",
          "relation": "mother"
        }
      }
    ]
  }
}
```

**Frontend Fields:**

| Field | Type | UI Component | Usage |
|-------|------|-------------|-------|
| `activityName` | String | Activity card title | Display activity name |
| `category` | Enum | Icon badge | MEAL=🍽️, NAP=😴, PLAY=🎮 |
| `startTime` | String | Time display | Start time |
| `endTime` | String | Time display | End time |
| `duration` | Int | Duration badge | "45 min" |
| `mood` | Enum | Emoji | HAPPY=😊, SLEEPY=😴, FUSSY=😢 |
| `photos` | URL[] | Image gallery | Activity photos |
| `source` | Enum | Badge | PARENT=🏠, DAYCARE=🏫 |

---

### **ActivityTimeline**

**Purpose:** Get unified timeline (parent + daycare activities)

**Variables:**
```json
{
  "input": {
    "childId": "65child123...",
    "startDate": "2026-02-20",
    "endDate": "2026-02-23",
    "includeDaycare": true
  }
}
```

**Query:**
```graphql
query GetActivityTimeline($input: ActivityTimelineInput!) {
  activityTimeline(input: $input) {
    date
    activities {
      activityName
      category
      startTime
      endTime
      source
      mood
      photos
    }
  }
}
```

**Response:**
```json
{
  "data": {
    "activityTimeline": [
      {
        "date": "2026-02-23",
        "activities": [
          {
            "activityName": "Makan Pagi",
            "category": "MEAL",
            "startTime": "07:00",
            "endTime": "07:30",
            "source": "PARENT",
            "mood": "HAPPY"
          },
          {
            "activityName": "Check-in",
            "category": "ROUTINE",
            "startTime": "08:00",
            "endTime": "08:15",
            "source": "DAYCARE",
            "mood": "HAPPY"
          }
        ]
      }
    ]
  }
}
```

---

## ✏️ Mutations

### **CreateActivity**

**Purpose:** Create new activity (parent/guardian input)

**Variables:**
```json
{
  "input": {
    "childId": "65child123...",
    "activityName": "Makan Malam",
    "category": "MEAL",
    "date": "2026-02-23",
    "startTime": "19:00",
    "endTime": "19:30",
    "mealType": "DINNER",
    "menu": "Nasi goreng ayam",
    "eaten": "ALL",
    "mood": "HAPPY",
    "photos": ["https://example.com/photo.jpg"],
    "description": "Habiskan semua makanannya"
  }
}
```

**Mutation:**
```graphql
mutation CreateActivity($input: CreateActivityInput!) {
  createActivity(input: $input) {
    id
    activityName
    category
  }
}
```

**Response:**
```json
{
  "data": {
    "createActivity": {
      "id": "65activity123...",
      "activityName": "Makan Malam",
      "category": "MEAL"
    }
  }
}
```

**Frontend Input Fields (by Category):**

| Category | Fields to Show | UI Components |
|----------|---------------|---------------|
| MEAL | mealType, menu, eaten | Meal type selector, Menu input, Eaten amount |
| NAP | quality, startTime, endTime | Quality selector, Time range |
| TOILETING | toiletingType, toiletingNotes | Type selector, Notes |
| PLAY/LEARNING | mood, photos, description | Mood selector, Photo upload, Description |
| CREATIVE | materials, photos | Materials input, Photo upload |
| PHYSICAL | intensity, mood | Intensity selector, Mood |
| OUTDOOR | location, photos | Location input, Photo upload |

**Frontend Implementation:**
```typescript
interface CreateActivityForm {
  childId: string;
  activityName: string;
  category: ActivityCategory;
  date: string;
  startTime: string;
  endTime?: string;
  
  // Category-specific fields
  mealType?: MealType;
  menu?: string;
  eaten?: EatenAmount;
  quality?: NapQuality;
  toiletingType?: ToiletingType;
  toiletingNotes?: string;
  mood?: Mood;
  photos?: string[];
  description?: string;
  intensity?: Intensity;
  location?: string;
  materials?: string;
}

const [createActivity] = useMutation(CREATE_ACTIVITY_MUTATION);

const handleSubmit = async (formData: CreateActivityForm) => {
  try {
    await createActivity({
      variables: { input: formData }
    });
    
    showToast('Activity berhasil ditambahkan');
    refetch(); // Refresh timeline
    
  } catch (error) {
    showToast('Gagal menambahkan activity');
  }
};
```

**Category-Specific Form:**
```tsx
function ActivityForm({ category, onSubmit }: ActivityFormProps) {
  const renderCategoryFields = () => {
    switch (category) {
      case 'MEAL':
        return (
          <>
            <Select
              name="mealType"
              options={[
                { value: 'BREAKFAST', label: 'Sarapan' },
                { value: 'SNACK', label: 'Camilan' },
                { value: 'LUNCH', label: 'Makan Siang' },
                { value: 'DINNER', label: 'Makan Malam' },
              ]}
            />
            <Input name="menu" label="Menu" />
            <Select
              name="eaten"
              options={[
                { value: 'ALL', label: 'Habiskan semua' },
                { value: 'SOME', label: 'Sebagian' },
                { value: 'NONE', label: 'Tidak makan' },
              ]}
            />
          </>
        );
      
      case 'NAP':
        return (
          <>
            <TimePicker name="startTime" label="Mulai tidur" />
            <TimePicker name="endTime" label="Bangun" />
            <Select
              name="quality"
              options={[
                { value: 'GOOD', label: 'Nyenyak' },
                { value: 'RESTLESS', label: 'Gelisah' },
                { value: 'SHORT', label: 'Sebentar' },
              ]}
            />
          </>
        );
      
      case 'PLAY':
      case 'LEARNING':
        return (
          <>
            <Select
              name="mood"
              options={[
                { value: 'HAPPY', label: '😊 Senang' },
                { value: 'SLEEPY', label: '😴 Mengantuk' },
                { value: 'FUSSY', label: '😢 Rewel' },
                { value: 'ENERGETIC', label: '⚡ Berenergi' },
                { value: 'NEUTRAL', label: '😐 Biasa' },
              ]}
            />
            <PhotoUpload name="photos" multiple />
            <Textarea name="description" label="Deskripsi" />
          </>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <form onSubmit={onSubmit}>
      <Input name="activityName" label="Nama Activity" required />
      <Select
        name="category"
        options={[
          { value: 'MEAL', label: '🍽️ Makan' },
          { value: 'NAP', label: '😴 Tidur' },
          { value: 'TOILETING', label: '🚽 Toileting' },
          { value: 'PLAY', label: '🎮 Bermain' },
          { value: 'LEARNING', label: '📚 Belajar' },
          { value: 'CREATIVE', label: '🎨 Kreatif' },
          { value: 'PHYSICAL', label: '⚽ Fisik' },
          { value: 'OUTDOOR', label: '🌳 Outdoor' },
        ]}
        required
      />
      {renderCategoryFields()}
      <Button type="submit">Simpan</Button>
    </form>
  );
}
```

---

## 🎨 UI Components

### **ActivityCard**
```tsx
interface ActivityCardProps {
  activity: Activity;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

function ActivityCard({ activity, onEdit, onDelete }: ActivityCardProps) {
  const categoryIcons = {
    MEAL: '🍽️',
    NAP: '😴',
    TOILETING: '🚽',
    PLAY: '🎮',
    LEARNING: '📚',
    CREATIVE: '🎨',
    PHYSICAL: '⚽',
    OUTDOOR: '🌳',
    ROUTINE: '📋',
    SOCIAL: '👥',
    DEVELOPMENT: '📈'
  };
  
  const moodEmojis = {
    HAPPY: '😊',
    SLEEPY: '😴',
    FUSSY: '😢',
    ENERGETIC: '⚡',
    NEUTRAL: '😐'
  };
  
  return (
    <Card>
      <div className="header">
        <span className="category-icon">{categoryIcons[activity.category]}</span>
        <div>
          <h4>{activity.activityName}</h4>
          <span className="time">{activity.startTime} - {activity.endTime}</span>
        </div>
        <Badge>{activity.source}</Badge>
      </div>
      <div className="body">
        {activity.mood && (
          <span className="mood">{moodEmojis[activity.mood]}</span>
        )}
        {activity.photos && activity.photos.length > 0 && (
          <PhotoGallery photos={activity.photos} />
        )}
        {activity.description && (
          <p className="description">{activity.description}</p>
        )}
      </div>
      {(onEdit || onDelete) && (
        <div className="actions">
          {onEdit && <Button onClick={() => onEdit(activity.id)}>Edit</Button>}
          {onDelete && <Button onClick={() => onDelete(activity.id)}>Delete</Button>}
        </div>
      )}
    </Card>
  );
}
```

### **ActivityTimeline**
```tsx
interface ActivityTimelineProps {
  activities: Activity[];
  onActivityClick: (id: string) => void;
}

function ActivityTimeline({ activities, onActivityClick }: ActivityTimelineProps) {
  // Group by date
  const grouped = groupBy(activities, 'date');
  
  return (
    <div className="timeline">
      {Object.entries(grouped).map(([date, dayActivities]) => (
        <div key={date} className="day">
          <h3>{formatDate(date)}</h3>
          <div className="activities">
            {dayActivities
              .sort((a, b) => a.startTime.localeCompare(b.startTime))
              .map(activity => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  onClick={() => onActivityClick(activity.id)}
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

## 📱 Screens

| Screen | Components | Route | Permissions |
|--------|-----------|-------|-------------|
| Activity Timeline | ActivityTimeline, ActivityCard | `/children/:id/activities` | Owner & Guardians |
| Add Activity | ActivityForm | `/children/:id/activities/new` | INPUT_ACTIVITY permission |
| Activity Detail | ActivityDetail | `/children/:id/activities/:id` | Owner & Guardians |

---

## 🔐 Permission Matrix

| Feature | SUPER_ADMIN | DAYCARE_OWNER | DAYCARE_ADMIN | DAYCARE_SITTER | PARENT (Owner) | PARENT (Guardian) |
|---------|-------------|---------------|---------------|----------------|----------------|-------------------|
| Get Activities | ✅ | ✅ | ✅ | ✅ | ✅ Own | ✅ Guarded |
| Create Activity | ✅ | ✅ | ✅ | ✅ | ✅ | With INPUT_ACTIVITY |
| Update Activity | ✅ | ✅ | ✅ | ✅ Own | ✅ Own | Creator only |
| Delete Activity | ✅ | ✅ | ✅ | ✅ Own | ✅ Own | Creator only |

---

**File:** `TDD_04_ACTIVITIES.md`  
**Version:** 1.0  
**Status:** Complete
