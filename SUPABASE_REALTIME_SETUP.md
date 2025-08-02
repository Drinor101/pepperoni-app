# Supabase Real-time Setup Guide

## Problemi
Dashboards nuk përditësohen në kohë reale sepse tabelat në Supabase nuk kanë aktivizuar replication.

## Zgjidhja
Aktivizoni replication për tabelat në Supabase Dashboard.

### Hapat:

1. **Hap Supabase Dashboard**
   - Shko në [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Zgjidh projektin tënd

2. **Shko te Table Editor**
   - Kliko "Table Editor" në sidebar-in e majtë

3. **Aktivizo Replication për çdo tabelë:**

   **Orders table:**
   - Kliko tabelën "orders"
   - Kliko tab-in "Replication"
   - Aktivizo ✅ INSERT, ✅ UPDATE, ✅ DELETE
   - Kliko "Save"

   **Drivers table:**
   - Kliko tabelën "drivers"
   - Kliko tab-in "Replication"
   - Aktivizo ✅ INSERT, ✅ UPDATE, ✅ DELETE
   - Kliko "Save"

   **Staff table:**
   - Kliko tabelën "staff"
   - Kliko tab-in "Replication"
   - Aktivizo ✅ INSERT, ✅ UPDATE, ✅ DELETE
   - Kliko "Save"

4. **Testo**
   - Hap aplikacionin në production
   - Krijoni një porosi të re
   - Duhet të shfaqet menjëherë në dashboards

## Nëse real-time nuk funksionon
Sistemi automatikisht përdor polling çdo 5 sekonda për të përditësuar të dhënat.

## Shënim
Pasi të aktivizoni replication, real-time do të funksionojë menjëherë në të gjitha dashboards. 