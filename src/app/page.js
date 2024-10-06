"use client"
import Navbar from "@/components/Navbar/Navbar";
import Slider from "@/components/Slider/Slider";
import { useState } from "react";


export default function Home() {
  const [search,setSearch] = useState('')
  const [submit,setSubmit] = useState(false)
  return (
    <div>
      <Navbar search={search} setSearch={setSearch} submit={submit} setSubmit={setSubmit}/>
      <Slider search={search} submit={submit} setSubmit={setSubmit}/>
    </div>
  );
}
