import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useLogout } from "../../../hooks/useLogout";
import { notify } from "../../../utils/notify";
import Loader from "../../../Components/Loader/Loader";
import { Flex, Switch, Text } from "@radix-ui/themes";
import { tryProtectedRequest } from "../../../utils/tryProtectedRequest";

export default function Regions({ refreshToken }) {
  const [regions, setRegions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cookies] = useCookies(["auth_token"]);
  const [userRegions, setUserRegions] = useState([]);
  const logout = useLogout();

  // 1. Получить все регионы
  const getRegions = async () => {
    try {
      const res = await fetch(
        "https://tendersiteapi.dev.regiuslab.by/v1/util/regions",
        { method: "GET", headers: { Accept: "application/json" } }
      );
      if (res.status === 404) {
        logout();
        return;
      }
      const data = await res.json();
      if (res.ok) {
        setRegions(data.regions);
        // после загрузки регионов — подгружаем сохранённые регионы пользователя
        getUserProfile(data.regions);
      }
    } catch (err) {
      notify({ title: "Ошибка", message: err.message, type: "danger" });
    }
  };

  // 2. Получаем выбранные регионы из профиля
  const getUserProfile = async (allRegions) => {
    try {
      const { data, response } = await tryProtectedRequest({
        url: "https://tendersiteapi.dev.regiuslab.by/v1/user/me",
        method: "GET",
        token: cookies.auth_token,
        refreshToken,
        logout,
      });
      if (response.ok) {
        const saved = data.selected_regions || [];
        if (saved.length) {
          // выставляем только те коды, что пришли из профиля
          setUserRegions(saved.map((r) => r.code));
          return;
        }
      }
      // если запрос не ок или ничего не пришло — включаем все коды
      setUserRegions(allRegions.map((r) => r.code));
    } catch {
      // в случае сетевой ошибки тоже включаем все
      setUserRegions(allRegions.map((r) => r.code));
    }
  };

  useEffect(() => {
    getRegions();
  }, []);

  // 3. Переключение одного региона с защитой от снятия всех
  const toggleRegion = (code) => {
    if (userRegions.length === 1 && userRegions[0] === code) {
      setUserRegions([]); 
      notify({ title: "Ошибка", message: "Нельзя отключить все регионы", type: "danger" });
      setTimeout(() => {
        setUserRegions(regions.map((r) => r.code));
      }, 200);
      return;
    }
    setUserRegions((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  // 4. Сохранение через PATCH
  const handleSave = async () => {
    if (!regions) return;
    setLoading(true);

    const selected_regions = userRegions.map((code) => {
      const reg = regions.find((r) => r.code === code);
      return { code: reg.code, name: reg.name };
    });

    try {
      const { response } = await tryProtectedRequest({
        url: "https://tendersiteapi.dev.regiuslab.by/v1/user/me",
        method: "PATCH",
        body: { selected_regions },
        token: cookies.auth_token,
        refreshToken,
        logout,
      });

      if (!response.ok) {
        notify({ title: "Ошибка", message: "Не удалось сохранить регионы", type: "danger" });
      } else {
        notify({ title: "Успешно", message: "Регионы сохранены", type: "success" });
      }
    } catch {
      notify({ title: "Ошибка", message: "Сетевая ошибка при сохранении", type: "danger" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-[30px]">
      <h2 className="text-3xl font-medium">Выбор регионов</h2>

      {regions ? (
        <ul className="flex flex-col gap-[10px]">
          {regions.map(({ code, name }) => (
            <li key={code}>
              <Text as="label" size="5" style={{ cursor: "pointer" }}>
                <Flex
                  align="center"
                  gap="4"
                  style={{ cursor: "pointer" }}
                  onClick={() => toggleRegion(code)}
                >
                  <Switch
                    radius="full"
                    checked={userRegions.includes(code)}
                    onCheckedChange={() => toggleRegion(code)}
                  />
                  {name}
                </Flex>
              </Text>
            </li>
          ))}
        </ul>
      ) : (
        <Loader isFull={false} color="var(--main)" />
      )}

      <button
        onClick={handleSave}
        disabled={loading}
        className="p-[7px_15px] w-fit rounded-xl text-white justify-center whitespace-nowrap
    bg-[var(--main)]/90 cursor-pointer hover:bg-[var(--main)] mt-[10px]"
      >
        {loading ? "Сохранение..." : "Сохранить"}
      </button>
    </div>
  );
}
