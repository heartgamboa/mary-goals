import { useContext } from "react"
import { GoalsContext } from "../context/GoalsContext"

export function useGoals() {
  const context = useContext(GoalsContext)

  if (!context) {
<<<<<<< HEAD
    throw new Error(`Outside the scope of the Goals Provider.`)
=======
    throw new Error("Outside the scope of the Goals Provider")
>>>>>>> 329236c89de1b765927f9e69d38a6430509a84cb
  }

  return context
}
