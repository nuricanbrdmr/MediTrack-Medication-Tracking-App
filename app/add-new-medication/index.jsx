import { ScrollView, StyleSheet } from 'react-native'
import React from 'react'
import AddMedicationHeader from '../../components/AddMedicationHeader'
import Colors from '../../constant/Colors'
import AddMedicationForm from '../../components/AddMedicationForm'

const AddNewMedication = () => {
  return (
    <ScrollView style={styles.container}>
      <AddMedicationHeader />
      <AddMedicationForm />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.WHITE
    },
})

export default AddNewMedication