import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  StatusBar,
} from "react-native";

const initialPeople = [
  { id: "1", name: "Дорж", year: "1940", gender: "Эрэгтэй", relation: "Өвөө" },
  { id: "2", name: "Сэржмаа", year: "1942", gender: "Эмэгтэй", relation: "Эмээ" },
  { id: "3", name: "Бат", year: "1965", gender: "Эрэгтэй", relation: "Аав" },
  { id: "4", name: "Цэцэг", year: "1968", gender: "Эмэгтэй", relation: "Ээж" },
  { id: "5", name: "Ганбат", year: "1990", gender: "Эрэгтэй", relation: "Ах" },
  { id: "6", name: "Энхболд", year: "1995", gender: "Эрэгтэй", relation: "Би" },
  { id: "7", name: "Отгон", year: "2002", gender: "Эмэгтэй", relation: "Дүү" },
];

function Avatar({ gender = "Эрэгтэй", small = false }) {
  return (
    <View style={[styles.avatar, small && styles.avatarSmall]}>
      <Text style={[styles.avatarText, small && styles.avatarTextSmall]}>
        {gender === "Эмэгтэй" ? "👩" : "👨"}
      </Text>
    </View>
  );
}

function PersonCard({ person, selected, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.personCard, selected && styles.personCardSelected]}
    >
      <Avatar gender={person.gender} />
      <Text style={styles.personName}>{person.name}</Text>
      <Text style={styles.personMeta}>{person.relation}</Text>
      <Text style={styles.personYear}>{person.year ? ${person.year} он : ""}</Text>
    </TouchableOpacity>
  );
}

export default function App() {
  const [screen, setScreen] = useState("home");
  const [people, setPeople] = useState(initialPeople);
  const [selectedId, setSelectedId] = useState("6");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    name: "",
    year: "",
    gender: "Эрэгтэй",
    relation: "Хамаатан",
  });

  const selectedPerson = people.find((p) => p.id === selectedId) || people[0];

  const filteredPeople = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return people;
    return people.filter((p) =>
      ${p.name} ${p.relation} ${p.year}.toLowerCase().includes(q)
    );
  }, [people, search]);

  function addPerson() {
    if (!form.name.trim()) {
      Alert.alert("Анхаарна уу", "Нэрээ оруулна уу.");
      return;
    }

    const newPerson = {
      id: Date.now().toString(),
      name: form.name.trim(),
      year: form.year.trim(),
      gender: form.gender,
      relation: form.relation.trim() || "Хамаатан",
    };

    setPeople((prev) => [...prev, newPerson]);
    setSelectedId(newPerson.id);
    setForm({
      name: "",
      year: "",
      gender: "Эрэгтэй",
      relation: "Хамаатан",
    });
    setScreen("tree");
  }

  function Header({ title, back = false }) {
    return (
      <View style={styles.header}>
        {back ? (
          <TouchableOpacity onPress={() => setScreen("home")} style={styles.headerButton}>
            <Text style={styles.headerButtonText}>‹</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => Alert.alert("Ургийн мод", "Эхний хувилбар")}
            style={styles.headerButton}
          >
            <Text style={styles.menuText}>☰</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>{title}</Text>
        <TouchableOpacity
          onPress={() => setScreen("search")}
          style={styles.headerButton}
        >
          <Text style={styles.searchIcon}>⌕</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function Home() {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="dark-content" />
        <Header title="УРГИЙН МОД" />
        <ScrollView contentContainerStyle={styles.homeContent}>
          <View style={styles.hero}>
            <Text style={styles.heroTree}>🌳</Text>
            <Text style={styles.welcome}>Сайн уу, Энхболд оо!</Text>
            <Text style={styles.subWelcome}>Өөрийн гэр бүлийнхээ модыг бүтээгээрэй.</Text>
          </View>

          <TouchableOpacity style={styles.menuCard} onPress={() => setScreen("tree")}>
            <Text style={styles.menuEmoji}>🌳</Text>
            <View style={styles.menuInfo}>
              <Text style={styles.menuTitle}>Миний ургийн мод</Text>
              <Text style={styles.menuSubtitle}>Ургийн модоо харах</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuCard} onPress={() => setScreen("search")}>
            <Text style={styles.menuEmoji}>🔎</Text>
            <View style={styles.menuInfo}>
              <Text style={styles.menuTitle}>Хайх</Text>
              <Text style={styles.menuSubtitle}>Гэр бүлийн хүнээ хайх</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuCard} onPress={() => setScreen("add")}>
            <Text style={styles.menuEmoji}>👨‍👩‍👧</Text>
            <View style={styles.menuInfo}>
              <Text style={styles.menuTitle}>Гэр бүлийн гишүүд</Text>
              <Text style={styles.menuSubtitle}>Шинэ хүн нэмэх</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuCard} onPress={() => setScreen("settings")}>
            <Text style={styles.menuEmoji}>⚙️</Text>
            <View style={styles.menuInfo}>
              <Text style={styles.menuTitle}>Тохиргоо</Text>
              <Text style={styles.menuSubtitle}>Апп-ын тохиргоо</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </ScrollView>
        <BottomNav active="home" />
      </SafeAreaView>
    );
  }

  function Tree() {
    const grand = people.filter((p) => p.relation === "Өвөө" || p.relation === "Эмээ");
    const parents = people.filter((p) => p.relation === "Аав" || p.relation === "Ээж");
    const children = people.filter((p) => ["Ах", "Би", "Дүү"].includes(p.relation));

    return (
      <SafeAreaView style={styles.safe}>
        <Header title="Миний ургийн мод" back />
        <ScrollView horizontal contentContainerStyle={styles.treeScroll}>
          <View style={styles.tree}>
            <Text style={styles.treeSection}>ӨВӨӨ • ЭМЭЭ</Text>
            <View style={styles.row}>
              {grand.map((p) => (
                <PersonCard
                  key={p.id}
                  person={p}
                  selected={p.id === selectedId}
                  onPress={() => setSelectedId(p.id)}
                />
              ))}
            </View>

            <Text style={styles.connector}>│{"\n"}▼</Text>

            <Text style={styles.treeSection}>ААВ • ЭЭЖ</Text>
            <View style={styles.row}>
              {parents.map((p) => (
                <PersonCard
                  key={p.id}
                  person={p}
                  selected={p.id === selectedId}
                  onPress={() => setSelectedId(p.id)}
                />
              ))}
            </View>

            <Text style={styles.connector}>│{"\n"}▼</Text>

            <Text style={styles.treeSection}>ХҮҮХДҮҮД</Text>
            <View style={styles.row}>
              {children.map((p) => (
                <PersonCard
                  key={p.id}
                  person={p}
                  selected={p.id === selectedId}
                  onPress={() => setSelectedId(p.id)}
                />
              ))}
              <TouchableOpacity style={styles.addChild} onPress={() => setScreen("add")}>
                <Text style={styles.plus}>＋</Text>
                <Text style={styles.addChildText}>Хүн нэмэх</Text>
              </TouchableOpacity>
            </View>

            {selectedPerson && (
              <View style={styles.selectedPanel}>
                <Avatar gender={selectedPerson.gender} small />
                <View style={{ flex: 1 }}>
                  <Text style={styles.selectedName}>{selectedPerson.name}</Text>
                  <Text style={styles.selectedMeta}>
                    {selectedPerson.relation} • {selectedPerson.year || "Төрсөн он оруулаагүй"}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.smallButton}
                  onPress={() => setScreen("person")}
                >
                  <Text style={styles.smallButtonText}>Мэдээлэл</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
        <BottomNav active="tree" />
      </SafeAreaView>
    );
  }

  function AddPerson() {
    return (
      <SafeAreaView style={styles.safe}>
        <Header title="Хүн нэмэх" back />
        <ScrollView contentContainerStyle={styles.formContainer}>
          <Text style={styles.label}>Нэр *</Text>
          <TextInput
            style={styles.input}
            placeholder="Жишээ: Бат"
            value={form.name}
            onChangeText={(v) => setForm({ ...form, name: v })}
          />

          <Text style={styles.label}>Төрсөн он</Text>
          <TextInput
            style={styles.input}
            placeholder="Жишээ: 1990"
            keyboardType="number-pad"
            value={form.year}
            onChangeText={(v) => setForm({ ...form, year: v })}
          />

          <Text style={styles.label}>Хүйс</Text>
          <View style={styles.segment}>
            {["Эрэгтэй", "Эмэгтэй"].map((g) => (
              <TouchableOpacity
                key={g}
                onPress={() => setForm({ ...form, gender: g })}
                style={[styles.segmentButton, form.gender === g && styles.segmentActive]}
              >
                <Text style={form.gender === g ? styles.segmentActiveText : styles.segmentText}>
                  {g}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Төрөл / Хамаарал</Text>
          <TextInput
            style={styles.input}
            placeholder="Жишээ: Аав, Ээж, Ах, Дүү"
            value={form.relation}
            onChangeText={(v) => setForm({ ...form, relation: v })}
          />

          <View style={styles.photoBox}>
            <Text style={styles.photoIcon}>📷</Text>
            <Text style={styles.photoText}>Зураг нэмэх</Text>
            <Text style={styles.photoHint}>Зургийн функцыг дараагийн хувилбарт холбоно.</Text>
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={addPerson}>
            <Text style={styles.primaryButtonText}>Хадгалах</Text>
          </TouchableOpacity>
        </ScrollView>
        <BottomNav active="add" />
      </SafeAreaView>
    );
  }

  function SearchScreen() {
    return (
      <SafeAreaView style={styles.safe}>
        <Header title="Хайх" back />
        <View style={styles.searchWrap}>
          <TextInput
            style={styles.searchInput}
            placeholder="Нэрээр хайх..."
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <ScrollView contentContainerStyle={styles.searchList}>
          {filteredPeople.map((p) => (
            <TouchableOpacity
              key={p.id}
              style={styles.searchPerson}
              onPress={() => {
                setSelectedId(p.id);
                setScreen("person");
              }}
            >
              <Avatar gender={p.gender} small />
              <View style={{ flex: 1 }}>
                <Text style={styles.searchName}>{p.name}</Text>
                <Text style={styles.searchMeta}>{p.relation} • {p.year || "—"}</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          ))}
          {filteredPeople.length === 0 && (
            <Text style={styles.emptyText}>Хүн олдсонгүй.</Text>
          )}
        </ScrollView>
        <BottomNav active="search" />
      </SafeAreaView>
    );
  }

  function Person() {
    if (!selectedPerson) return null;
    return (
      <SafeAreaView style={styles.safe}>
        <Header title="Хүний мэдээлэл" back />
        <ScrollView contentContainerStyle={styles.personContainer}>
          <Avatar gender={selectedPerson.gender} />
          <Text style={styles.profileName}>{selectedPerson.name}</Text>
          <Text style={styles.profileRelation}>{selectedPerson.relation}</Text>

          <View style={styles.infoCard}>
            <InfoRow icon="📅" label="Төрсөн он" value={selectedPerson.year || "Оруулаагүй"} />
            <InfoRow icon="⚥" label="Хүйс" value={selectedPerson.gender} />
            <InfoRow icon="👨‍👩‍👧" label="Төрөл" value={selectedPerson.relation} />
            <InfoRow icon="🖼️" label="Зураг" value="Зураг нэмэх" />
          </View>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => Alert.alert("Засах", "Засварлах хэсгийг дараагийн хувилбарт нэмнэ.")}
          >
            <Text style={styles.primaryButtonText}>Засах</Text>
          </TouchableOpacity>
        </ScrollView>
        <BottomNav active="tree" />
      </SafeAreaView>
    );
  }

  function InfoRow({ icon, label, value }) {
    return (
      <View style={styles.infoRow}>
        <Text style={styles.infoIcon}>{icon}</Text>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    );
  }

  function Settings() {
    return (
      <SafeAreaView style={styles.safe}>
        <Header title="Тохиргоо" back />
        <ScrollView contentContainerStyle={styles.settings}>
          <Text style={styles.settingsSection}>Ерөнхий</Text>
          <SettingRow title="🌐  Хэл" value="Монгол" />
          <SettingRow title="☀️  Харагдах байдал" value="Гэрэлтэй" />
          <SettingRow title="🔔  Мэдэгдэл" value="Асаалттай" />

          <Text style={styles.settingsSection}>Аюулгүй байдал</Text>
          <SettingRow title="🔑  Нууц үг өөрчлөх" />
          <SettingRow title="🛡️  Хоёр алхат баталгаажуулалт" value="Унтраах" />

          <Text style={styles.settingsSection}>Бусад</Text>
          <SettingRow title="☁️  Нөөцлөх / Сэргээх" />
          <SettingRow title="ⓘ  Бидний тухай" />
          <SettingRow title="↪  Гарах" danger />
        </ScrollView>
        <BottomNav active="settings" />
      </SafeAreaView>
    );
  }

  function SettingRow({ title, value, danger }) {
    return (
      <TouchableOpacity style={styles.settingRow}>
        <Text style={[styles.settingTitle, danger && styles.danger]}>{title}</Text>
        <Text style={styles.settingValue}>{value || "›"}</Text>
      </TouchableOpacity>
    );
  }

  function BottomNav({ active }) {
    return (
      <View style={styles.bottomNav}>
        <NavItem icon="⌂" label="Нүүр" active={active === "home"} onPress={() => setScreen("home")} />
        <NavItem icon="⌕" label="Хайх" active={active === "search"} onPress={() => setScreen("search")} />
        <TouchableOpacity style={styles.fab} onPress={() => setScreen("add")}>
          <Text style={styles.fabText}>＋</Text>
        </TouchableOpacity>
        <NavItem icon="☷" label="Мод" active={active === "tree"} onPress={() => setScreen("tree")} />
        <NavItem icon="⚙" label="Профайл" active={active === "settings"} onPress={() => setScreen("settings")} />
      </View>
    );
  }

  function NavItem({ icon, label, active, onPress }) {
    return (
      <TouchableOpacity onPress={onPress} style={styles.navItem}>
        <Text style={[styles.navIcon, active && styles.navActive]}>{icon}</Text>
        <Text style={[styles.navLabel, active && styles.navActive]}>{label}</Text>
      </TouchableOpacity>
    );
  }

  if (screen === "home") return <Home />;
  if (screen === "tree") return <Tree />;
  if (screen === "add") return <AddPerson />;
  if (screen === "search") return <SearchScreen />;
  if (screen === "person") return <Person />;
  return <Settings />;
}
