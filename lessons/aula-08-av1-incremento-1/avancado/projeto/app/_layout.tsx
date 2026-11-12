import React from 'react';
import {Stack} from 'expo-router';
import {StatusBar} from 'expo-status-bar';
import {DomainProvider} from '../src/DomainStore';
export default function Layout(){
  return <DomainProvider><StatusBar style="auto"/><Stack screenOptions={{headerStyle:{backgroundColor:'#093d39'},headerTintColor:'#fff',headerTitleStyle:{fontWeight:'bold'}}}>
    <Stack.Screen name="index" options={{title:'A08 · Centro de Operações'}}/>
    <Stack.Screen name="detalhe/[id]" options={{title:'Inspecionar registro'}}/>
    <Stack.Screen name="novo" options={{title:'Novo registro'}}/>
  </Stack></DomainProvider>;
}
