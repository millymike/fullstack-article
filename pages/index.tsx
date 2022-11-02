import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { prisma } from "../lib/prisma";

interface Articles {
  articles: {
    id: string;
    title: string;
    content: string;
  }[];
}

interface FormData {
  title: string;
  content: string;
  id: string;
}

const Home = ({ articles }: Articles) => {
  const [form, setForm] = useState<FormData>({
    title: "",
    content: "",
    id: "",
  });

  const router = useRouter();

  const refreshData = () => {
    router.replace(router.asPath);
  };

  async function create(data: FormData) {
    try {
      fetch("http://localhost:3000/api/create", {
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      }).then(() => {
        if (data.id) {
          deleteArticle(data.id);
          setForm({ title: "", content: "", id: "" });
          refreshData();
        } else {
          setForm({ title: "", content: "", id: "" });
          refreshData();
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteArticle(id: string) {
    try {
      fetch(`http://localhost:3000/api/article/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "DELETE",
      }).then(() => {
        refreshData();
      });
    } catch (error) {
      console.log(error);
    }
  }

  const handleSubmit = async (data: FormData) => {
    try {
      create(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1 className="text-center font-bold text-2xl mt-4">ARTICLES</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(form);
        }}
        className="w-auto min-w-[50%] max-w-min mx-auto space-y-6 flex flex-col items-stretch"
      >
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="border-2 rounded border-gray-600 p-1"
        />
        <textarea
          placeholder="Content"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          className="border-2 rounded border-gray-600 p-1"
        />

        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Add +
        </button>
      </form>
      <div className="w-auto min-w-[50%] max-w-min mx-auto space-y-6 flex flex-col items-stretch">
        <ul>
          {articles.map((article) => (
            <li key={article.id} className="border-b broder-gray-600 p-2">
              <div className="flex justify-between">
                <div className="flex-1">
                  <h3 className="font-bold">{article.title}</h3>
                  <p className="text-sm">{article.content}</p>
                </div>
                <button
                  onClick={() =>
                    setForm({
                      title: article.title,
                      content: article.content,
                      id: article.id,
                    })
                  }
                  className="bg-blue-500 px-3 text-white rounded hover:bg-blue-800"
                >
                  Update
                </button>
                <button
                  onClick={() => deleteArticle(article.id)}
                  className="bg-red-500 px-3 text-white rounded hover:bg-red-800"
                >
                  X
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async () => {
  const articles = await prisma.article.findMany({
    select: {
      title: true,
      id: true,
      content: true,
    },
  });

  return {
    props: {
      articles,
    },
  };
};
