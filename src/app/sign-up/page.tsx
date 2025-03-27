"use client"

import { DatePicker } from "@/components/DatePicker";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import Image from 'next/image'

import Header from "@/components/Header";
import DropdownWithSearch from "@/components/DropdownWithSearch";
import Dropdown from "@/components/Dropdown";

const states = [
  'Perlis',
  'Pahang',
  'Perak',
  'Kedah',
  'Kelantan',
  'Terengganu',
  'Pulau Pinang',
  'Kuala Lumpur',
  'Putrajaya',
  'Selangor',
  'Labuan',
  'Melaka',
  'Negeri Sembilan',
  'Johor',
  'Sabah',
  'Sarawak'
].toSorted()

const genders = [
  'Male',
  'Female',
  'Prefer not to say'
]

const maritial = [
  'Married',
  'Divorced',
  'Widowed',
  'Single'
]

const education = [
  'Doctorate',
  'Master',
  'Bachelor',
  'Secondary',
  'No Education'
]

const employment = [
  'Employed',
  'Unemployed',
  'Self-Employed',
  'Student'
]

const residency = [
  'Citizen',
  'Non-citizen'
]

type UserInfo = {
  firstName: string,
  middleName: string,
  lastName: string,
  dateOfBirth: Date,
  gender: string,
  ethnicity: string,
  religion: string,
  residencyStatus: string,
  employmentStatus: string,
  maritialStatus: string,
  educationLevel: string,
  phoneNumber: string,
  address: string,
  postcode: string,
  city: string,
  state: string
}


export default function SignUp() {

  const router = useRouter()

  const [state, setState] = useState('')
  const [gender, setGender] = useState('')
  const [maritialStatus, setMartitialStatus] = useState('')
  const [residencyStatus, setResidencyStatus] = useState('')
  const [educationLevel, setEducationLevel] = useState('')
  const [employmentStatus, setEmploymentStatus] = useState('')
  const [dob, setDOB] = useState<Date>(new Date(Date.now()))

  const submitSignUp = async (formdata: FormData) => {
  
      const object = {
          firstName: formdata.get('firstName'),
          middleName: formdata.get('middleName'),
          lastName: formdata.get('lastName'),
          dateOfBirth: dob,
          gender,
          ethnicity: formdata.get('ethnicity'),
          religion: formdata.get('religion'),
          residencyStatus,
          employmentStatus,
          maritialStatus,
          educationLevel,
          phoneNumber: formdata.get('phone'),
          address: formdata.get('address1') + ' ' + formdata.get('address2'),
          postcode: formdata.get('postcode'),
          city: formdata.get('city'),
          state: state
      } as UserInfo

      // halleluyah
      const response = await fetch('/api/sign-up', {
          method: 'POST',
          body: JSON.stringify(object)
      })
      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error)
      } else
          router.push('/dashboard')
  }  

  return (
      <div className="flex flex-col h-screen w-screen bg-[#EFF8FC] justify-center items-center">
        <Header userLoggedIn={false}/>
        <div className="text-5xl font-bold text-black p-10">
          Before you begin, we&apos;ll need some details.
        </div>
        <div className="text-black">
          <form
          className="flex flex-col space-x-8 justify-center items-center"
          action={submitSignUp}>
              
            <div className="flex flex-row space-x-8">
              <div className="flex flex-col space-y-4">
                <div className="space-y-1">
                    <div className="text-xl pl-2">First Name</div>
                    <input className="bg-white text-black w-96 h-12 p-5 rounded-lg inset-shadow-sm inset-shadow-indigo-200"
                    name="firstName" />
                  </div>
                <div className="space-y-1">
                  <div className="text-xl pl-2">Middle Name</div>
                  <input className="bg-white text-black w-96 h-12 p-5 rounded-lg inset-shadow-sm inset-shadow-indigo-200"
                  name="middleName" />
                </div>
                <div className="space-y-1">
                  <div className="text-xl pl-2">Last Name</div>
                  <input className="bg-white text-black w-96 h-12 p-5 rounded-lg inset-shadow-sm inset-shadow-indigo-200"
                  name="lastName" />
                </div>
                <div className="space-y-1">
                  <div className="text-xl pl-2">Date of Birth</div>
                  <DatePicker date={dob} setDate={setDOB}/>
                </div>
                <div className="space-y-1">
                  <div className="text-xl pl-2">Gender</div>
                  <Dropdown options={genders} label="Gender" selected={gender} setSelected={setGender}/>
                </div>
                <div className="space-y-1">
                  <div className="text-xl pl-2">Identification Number</div>
                  <input className="bg-white text-black w-96 h-12 p-5 rounded-lg inset-shadow-sm inset-shadow-indigo-200"
                  name="idNumber"/>
                </div>
              </div>

              <div className="flex flex-col space-y-4">
                <div className="space-y-1">
                  <div className="text-xl pl-2">Ethnicity</div>
                  <input className="bg-white text-black w-96 h-12 p-5 rounded-lg inset-shadow-sm inset-shadow-indigo-200"
                  name="ethnicity" />
                </div>
                <div className="space-y-1">
                  <div className="text-xl pl-2">Religion</div>
                  <input className="bg-white text-black w-96 h-12 p-5 rounded-lg inset-shadow-sm inset-shadow-indigo-200"
                  name="religion" />
                </div>
                <div className="space-y-1">
                  <div className="text-xl pl-2">Residency Status</div>
                  <Dropdown options={residency} label="Residency Status" selected={residencyStatus} setSelected={setResidencyStatus}/>
                </div>
                <div className="space-y-1">
                  <div className="text-xl pl-2">Employment Status</div>
                  <Dropdown options={employment} label="Employment Status" selected={employmentStatus} setSelected={setEmploymentStatus}/>
                </div>
                <div className="space-y-1">
                  <div className="text-xl pl-2">Martial Status</div>
                  <Dropdown options={maritial} label="Maritial Status" selected={maritialStatus} setSelected={setMartitialStatus}/>
                </div>
                <div className="space-y-1">
                  <div className="text-xl pl-2">Education Level</div>
                 <Dropdown options={education} label="Education Level" selected={educationLevel} setSelected={setEducationLevel}/>
                </div>
              </div>

              <div className="flex flex-col space-y-4">
                <div className="space-y-1">
                  <div className="text-xl pl-2">Phone Number</div>
                  <input className="bg-white text-black w-96 h-12 p-5 rounded-lg inset-shadow-sm inset-shadow-indigo-200"
                  name="phone" placeholder="+60"/>
                </div>
                <div className="space-y-1">
                  <div className="text-xl pl-2">Address Line 1</div>
                  <input className="bg-white text-black w-96 h-12 p-5 rounded-lg inset-shadow-sm inset-shadow-indigo-200"
                  name="address1"/>
                </div>
                <div className="space-y-1">
                  <div className="text-xl pl-2">Address Line 2</div>
                  <input className="bg-white text-black w-96 h-12 p-5 rounded-lg inset-shadow-sm inset-shadow-indigo-200"
                  name="address2"/>
                </div>
                <div className="space-y-1">
                  <div className="text-xl pl-2">Postcode</div>
                  <input className="bg-white text-black w-96 h-12 p-5 rounded-lg inset-shadow-sm inset-shadow-indigo-200"
                  name="postcode" />
                </div>
                <div className="space-y-1">
                  <div className="text-xl pl-2">City</div>
                  <input className="bg-white text-black w-96 h-12 p-5 rounded-lg inset-shadow-sm inset-shadow-indigo-200"
                  name="city" />
                </div>
                <div className="space-y-1">
                  <div className="text-xl pl-2">State</div>
                  <DropdownWithSearch options={states} label="state" selected={state} setSelected={setState}/>
                </div>
              </div>

            </div>

            <motion.button 
              className="flex flex-row justify-center items-center w-24 h-12 bg-[#6E61E3]
              rounded-lg cursor-pointer mt-7"
              whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.95 }}
              type="submit"
            >
              <Image src={'/rightarrow.svg'} alt='next' width={25} height={25}/>
            </motion.button>
          </form>
        </div>
      </div>
  )
}