import React, { useMemo, useState, useEffect } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@family_tree_people";

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
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    name: "",
    year: "",
    gender: "Эрэгтэй",
    relation: "Хамаатан",
  });

  // Өгөгдөл утасны санамжаас ачаалах
  useEffect(() => {
    loadPeople();
  }, []);

  // Хүмүүсийн жагсаалт өөрчлөгдөх бүрт санамжинд хадгалах
  const savePeople = async (newPeople) => {
    try {
      setPeople(newPeople);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newPeople));
    } catch (e) {
      console.error(e);
    }
  };

  const loadPeople = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) setPeople(JSON.parse(data));
    } catch (e) {
      console.error(e);
    }
  };

  const selectedPerson = people.find((p) => p.id === selectedId) || people[0];

  const filteredPeople = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return people;
    return people.filter((p) =>
      ${p.name} ${p.relation} ${p.year}.toLowerCase().includes(q)
    );
  }, [people, search]);

  function handleSavePerson() {
    if (!form.name.trim()) {
      Alert.alert("Анхаарна уу", "Нэрээ оруулна уу.");
      return;
    }

    if (editingId) {
      const updated = people.map((p) =>
        p.id === editingId ? { ...p, ...form } : p
      );
      savePeople(updated);
      setEditingId(null);
    } else {
      const newPerson = {
        id: Date.now().toString(),
        name: form.name.trim(),
        year: form.year.trim(),
        gender: form.gender,
        relation: form.relation.trim() || "Хамаатан",
      };
      savePeople([...people, newPerson]);
      setSelectedId(newPerson.id);
    }

    setForm({ name: "", year: "", gender: "Эрэгтэй", relation: "Хамаатан" });
    setScreen("tree");
  }

  function deletePerson(id) {
    Alert.alert("Устгах", "Энэ хүнийг устгахдаа итгэлтэй байна уу?", [
      { text: "Үгүй", style: "cancel" },
      {
        text: "Тийм",
        style: "destructive",
        onPress: () => {
          const updated = people.filter((p) => p.id !== id);
          savePeople(updated);
          setScreen("tree");
        },
      },
    ]);
  }

  function startEdit(person) {
    setEditingId(person.id);
    setForm({
      name: person.name,
      year: person.year,
      gender: person.gender,
      relation: person.relation,
    });
    setScreen("add");
  }

  function Header({ title, back = false }) {
    return (
      <View style={styles.header}>
        {back ? (
          <TouchableOpacity onPress={() => setScreen("home")} style={styles.headerButton}>
            <Text style={styles.headerButtonText}>‹</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => Alert.alert("Ургийн мод", "v1.1")} style={styles.headerButton}>
            <Text style={styles.menuText}>☰</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>{title}</Text>
        <TouchableOpacity onPress={() => setScreen("search")} style={styles.headerButton}>
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
            <Text style={styles.welcome}>Сайн уу!</Text>
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
          <TouchableOpacity
            style={styles.menuCard}
            onPress={() => {
              setEditingId(null);
              setForm({ name: "", year: "", gender: "Эрэгтэй", relation: "Хамаатан" });
              setScreen("add");
            }}
          >
            <Text style={styles.menuEmoji}>👨‍👩‍👧</Text>
            <View style={styles.menuInfo}>
              <Text style={styles.menuTitle}>Гэр бүлийн гишүүд</Text>
              <Text style={styles.menuSubtitle}>Шинэ хүн нэмэх</Text>
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
                <PersonCard key={p.id} person={p} selected={p.id === selectedId} onPress={() => setSelectedId(p.id)} />
              ))}
            </View>
            <Text style={styles.connector}>│{"\n"}▼</Text>
            <Text style={styles.treeSection}>ААВ • ЭЭЖ</Text>
            <View style={styles.row}>
              {parents.map((p) => (
                <PersonCard key={p.id} person={p} selected={p.id === selectedId} onPress={() => setSelectedId(p.id)} />
              ))}
            </View>
            <Text style={styles.connector}>│{"\n"}▼</Text>
            <Text style={styles.treeSection}>ХҮҮХДҮҮД</Text>
            <View style={styles.row}>
              {children.map((p) => (
                <PersonCard key={p.id} person={p} selected={p.id === selectedId} onPress={() => setSelectedId(p.id)} />
              ))}
            </View>
            {selectedPerson && (
              <View style={styles.selectedPanel}>
                <Avatar gender={selectedPerson.gender} small />
                <View style={{ flex: 1 }}>
                  <Text style={styles.selectedName}>{selectedPerson.name}</Text>
                  <Text style={styles.selectedMeta}>{selectedPerson.relation} • {selectedPerson.year || "—"}</Text>
                </View>
                <TouchableOpacity style={styles.smallButton} onPress={() => setScreen("person")}>
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
        <Header title={editingId ? "Мэдээлэл засах" : "Хүн нэмэх"} back />
        <ScrollView contentContainerStyle={styles.formContainer}>
          <Text style={styles.label}>Нэр *</Text>
          <TextInput style={styles.input} placeholder="Жишээ: Бат" value={form.name} onChangeText={(v) => setForm({ ...form, name: v })} />
          <Text style={styles.label}>Төрсөн он</Text>
          <TextInput style={styles.input} placeholder="Жишээ: 1990" keyboardType="number-pad" value={form.year} onChangeText={(v) => setForm({ ...form, year: v })} />
          <Text style={styles.label}>Хүйс</Text>
          <View style={styles.segment}>
            {["Эрэгтэй", "Эмэгтэй"].map((g) => (
              <TouchableOpacity key={g} onPress={() => setForm({ ...form, gender: g })} style={[styles.segmentButton, form.gender === g && styles.segmentActive]}>
                <Text style={form.gender === g ? styles.segmentActiveText : styles.segmentText}>{g}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.label}>Төрөл / Хамаарал</Text>
          <TextInput style={styles.input} placeholder="Жишээ: Аав, Ээж, Ах, Дүү" value={form.relation} onChangeText={(v) => setForm({ ...form, relation: v })} />
          <TouchableOpacity style={styles.primaryButton} onPress={handleSavePerson}>
            <Text style={styles.primaryButtonText}>{editingId ? "Шинэчлэх" : "Хадгалах"}</Text>
          </TouchableOpacity>
        </ScrollView>
        <BottomNav active="add" />
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
          </View>
          <TouchableOpacity style={styles.primaryButton} onPress={() => startEdit(selectedPerson)}>
            <Text style={styles.primaryButtonText}>Засах</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.primaryButton, styles.dangerButton]} onPress={() => deletePerson(selectedPerson.id)}>
            <Text style={styles.primaryButtonText}>Устгах</Text>
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

  function SearchScreen() {
    return (
      <SafeAreaView style={styles.safe}>
        <Header title="Хайх" back />
        <View style={styles.searchWrap}>
          <TextInput style={styles.searchInput} placeholder="Нэрээр хайх..." value={search} onChangeText={setSearch} />
        </View>
        <ScrollView contentContainerStyle={styles.searchList}>
          {filteredPeople.map((p) => (
            <TouchableOpacity key={p.id} style={styles.searchPerson} onPress={() => { setSelectedId(p.id); setScreen("person"); }}>
              <Avatar gender={p.gender} small />
              <View style={{ flex: 1 }}>
                <Text style={styles.searchName}>{p.name}</Text>
                <Text style={styles.searchMeta}>{p.relation} • {p.year || "—"}</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <BottomNav active="search" />
      </SafeAreaView>
    );
  }

  function BottomNav({ active }) {
    return (
      <View style={styles.bottomNav}>
        <NavItem icon="⌂" label="Нүүр" active={active === "home"} onPress={() => setScreen("home")} />
        <NavItem icon="⌕" label="Хайх" active={active === "search"} onPress={() => setScreen("search")} />
        <TouchableOpacity style={styles.fab} onPress={() => { setEditingId(null); setForm({ name: "", year: "", gender: "Эрэгтэй", relation: "Хамаатан" }); setScreen("add"); }}>
          <Text style={styles.fabText}>＋</Text>
        </TouchableOpacity>
        <NavItem icon="☷" label="Мод" active={active === "tree"} onPress={() => setScreen("tree")} />
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
  return <Person />;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F7F9FC" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16, backgroundColor: "#FFF", borderBottomWidth: 1, borderColor: "#EEE" },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  headerButton: { padding: 8 },
  headerButtonText: { fontSize: 24 },
  menuText: { fontSize: 20 },
  searchIcon: { fontSize: 20 },
  homeContent: { padding: 16 },
  hero: { alignItems: "center", marginVertical: 20 },
  heroTree: { fontSize: 50 },
  welcome: { fontSize: 22, fontWeight: "bold", marginTop: 8 },
  subWelcome: { color: "#666", marginTop: 4 },
  menuCard: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFF", padding: 16, borderRadius: 12, marginBottom: 12 },
  menuEmoji: { fontSize: 24, marginRight: 16 },
  menuInfo: { flex: 1 },
  menuTitle: { fontSize: 16, fontWeight: "bold" },
  menuSubtitle: { color: "#888", fontSize: 12 },
  chevron: { fontSize: 20, color: "#CCC" },
  treeScroll: { padding: 20 },
  tree: { alignItems: "center" },
  treeSection: { fontSize: 12, fontWeight: "bold", color: "#888", marginVertical: 10 },
  row: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center" },
  personCard: { backgroundColor: "#FFF", padding: 12, borderRadius: 8, alignItems: "center", margin: 6, minWidth: 80, borderWidth: 1, borderColor: "#EEE" },
  personCardSelected: { borderColor: "#007AFF", backgroundColor: "#F0F8FF" },
  personName: { fontWeight: "bold", fontSize: 14, marginTop: 4 },
  personMeta: { fontSize: 10, color: "#666" },
  personYear: { fontSize: 10, color: "#999" },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#E1E8ED", justifyContent: "center", alignItems: "center" },
  avatarSmall: { width: 30, height: 30, borderRadius: 15 },
  avatarText: { fontSize: 20 },
  avatarTextSmall: { fontSize: 14 },
  connector: { textAlign: "center", color: "#AAA", marginVertical: 4 },
  selectedPanel: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFF", padding: 12, borderRadius: 8, marginTop: 20, width: "100%" },
  selectedName: { fontWeight: "bold" },
  selectedMeta: { color: "#666", fontSize: 12 },
  smallButton: { backgroundColor: "#007AFF", padding: 8, borderRadius: 6 },
  smallButtonText: { color: "#FFF", fontSize: 12 },
  formContainer: { padding: 16 },
  label: { fontSize: 14, fontWeight: "bold", marginVertical: 8 },
  input: { backgroundColor: "#FFF", padding: 12, borderRadius: 8, borderWidth: 1, borderColor: "#DDD" },
  segment: { flexDirection: "row", marginVertical: 8 },
  segmentButton: { flex: 1, padding: 12, alignItems: "center", backgroundColor: "#EEE", borderRadius: 8, marginRight: 8 },
  segmentActive: { backgroundColor: "#007AFF" },
  segmentText: { color: "#333" },
  segmentActiveText: { color: "#FFF", fontWeight: "bold" },
  primaryButton: { backgroundColor: "#007AFF", padding: 16, borderRadius: 8, alignItems: "center", marginTop: 16 },
  dangerButton: { backgroundColor: "#FF3B30" },
  primaryButtonText: { color: "#FFF", fontWeight: "bold" },
  personContainer: { padding: 16, alignItems: "center" },
  profileName: { fontSize: 22, fontWeight: "bold", marginTop: 8 },
  profileRelation: { color: "#666", marginBottom: 16 },
  infoCard: { backgroundColor: "#FFF", borderRadius: 8, width: "100%", padding: 8, marginBottom: 16 },
  infoRow: { flexDirection: "row", padding: 12, borderBottomWidth: 1, borderBottomColor: "#EEE" },
  infoIcon: { marginRight: 12 },
  infoLabel: { flex: 1, color: "#666" },
  infoValue: { fontWeight: "bold" },
  searchWrap: { padding: 16 },
  searchInput: { backgroundColor: "#FFF", padding: 12, borderRadius: 8, borderWidth: 1, borderColor: "#DDD" },
  searchList: { padding: 16 },
  searchPerson: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFF", padding: 12, borderRadius: 8, marginBottom: 8 },
  searchName: { fontWeight: "bold" },
  searchMeta: { color: "#666", fontSize: 12 },
  bottomNav: { flexDirection: "row", backgroundColor: "#FFF", borderTopWidth: 1, borderColor: "#EEE", paddingVertical: 8 },
  navItem: { flex: 1, alignItems: "center" },
  navIcon: { fontSize: 20, color: "#888" },
  navLabel: { fontSize: 10, color: "#888" },
  navActive: { color: "#007AFF" },
  fab: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#007AFF", justifyContent: "center", alignItems: "center", marginTop: -12 },
  fabText: { color: "#FFF", fontSize: 24 },
});
