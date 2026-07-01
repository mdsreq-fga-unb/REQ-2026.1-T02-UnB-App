import { NativeTabs } from "expo-router/unstable-native-tabs";
import { SigaaSync } from "../../components/SigaaSync";

export default function TabLayout() {
  return (
    <>
      <NativeTabs tintColor="#1d8d28">
        <NativeTabs.Trigger name="index">
          <NativeTabs.Trigger.Icon sf="house.fill" md="home" />
          <NativeTabs.Trigger.Label>Início</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="disciplinas">
          <NativeTabs.Trigger.Icon sf="book.fill" md="menu_book" />
          <NativeTabs.Trigger.Label>Disciplinas</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="documents">
          <NativeTabs.Trigger.Icon sf="doc.fill" md="description" />
          <NativeTabs.Trigger.Label>Documentos</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="ajustes">
          <NativeTabs.Trigger.Icon sf="gearshape.fill" md="settings" />
          <NativeTabs.Trigger.Label>Ajustes</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
      </NativeTabs>
      
      <SigaaSync />
    </>
  );
}