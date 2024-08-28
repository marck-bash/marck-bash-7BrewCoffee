import { useEffect, useState } from "react";
import EditRecipeButton from "./Edit-Recipe-Button";
import DeleteRecipeButton from "./Delete-Recipe-Button";

export default function DisplayRecipes() {
  // State to store set room value
  const [recipes, setRecipes] = useState([]);

  //uses allRooms route in room controller to display all rooms from db
  async function retrieveRecipesList() {
    const response = await fetch("http://localhost:3000/allRecipes", {
      method: "GET",
      headers: {
        "content-type": "application/json",
        authorization: localStorage.getItem("jwt-token"),
      },
    });
    const responseArray = await response.json();

    //checking if request was successful
    if (response.status === 200) {
      console.log(responseArray);
      setRecipes(responseArray);
    } else {
      console.log("error");
    }
  }

  useEffect(() => {
    retrieveRecipesList();
  }, []);

  const [user, setUser] = useState([]);

  //useEffect to fetch our current user from our database
  useEffect(() => {
    const fetchResults = async () => {
      try {
        let response = await fetch("http://localhost:3000/user/role", {
          method: "GET",
          headers: {
            "content-type": "application/json",
            authorization: localStorage.getItem("jwt-token"),
          },
        });
        const body = await response.json();
        setUser(body);
      } catch (error) {
        console.log(error);
      }
    };
    fetchResults();
  }, []);

  //maping our user array to role for use in our conditional rendering
  const userRole = user.map((list) => list.role);

  //displays table of currently available rooms
  return (
    <>
      <div className="flex flex-col justify-center items-center overflow-y-auto h-full">
        <div className="text-6xl font-bold text-primary mb-[12px]">
          All Recipes
        </div>
        <div className="border-2 border-secondary mb-[16px] w-[30rem]"></div>
        <div className="overflow-y-auto border-2 border-secondary mb-12 w-3/5">
          <table className="table table-pin-rows">
            <tbody className=" flex-inline text-neutral">
              {recipes.map((recipe) => (
                <tr
                  key={recipe._id}
                  className=" flex-inline justify-center border-secondary"
                >
                  <td className=" flex justify-center text-primary">
                    {"Recipe Name"}
                  </td>
                  <td className=" flex justify-center">{recipe.name}</td>
                  <td className=" flex justify-center text-primary">
                    {"Recipe Ingredients"}
                  </td>
                  <td className=" flex justify-center">{recipe.ingredients}</td>
                  <td className=" flex justify-center text-primary">
                    {"Recipe Directions"}
                  </td>
                  <td className=" flex justify-center">{recipe.directions}</td>
                  {
                    // conditional rendering to prevent users without Admin, Manager,
                    // and Regional Manager from seeing these renderings
                    userRole[0] === "Admin" ||
                    userRole[0] === "Manager" ||
                    userRole[0] === "Regional Manager" ? (
                      <>
                        <td className=" flex justify-center gap-2">
                          <EditRecipeButton recipe={recipe} />
                          <DeleteRecipeButton recipe={recipe} />
                        </td>
                      </>
                    ) : (
                      <></>
                    )
                  }
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
