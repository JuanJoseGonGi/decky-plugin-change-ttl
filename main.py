import decky_plugin
import subprocess

class Plugin:
    async def get(self):
        try:
            # Get IPv4 TTL
            ipv4_result = subprocess.run(['sysctl', 'net.ipv4.ip_default_ttl'], capture_output=True, text=True)
            ipv4_ttl = int(ipv4_result.stdout.split('=')[1].strip())

            # Get IPv6 TTL
            ipv6_result = subprocess.run(['sysctl', 'net.ipv6.conf.all.hop_limit'], capture_output=True, text=True)
            ipv6_ttl = int(ipv6_result.stdout.split('=')[1].strip())

            return {
                "success": True,
                "result": {
                    "ipv4": ipv4_ttl,
                    "ipv6": ipv6_ttl
                }
            }
        except Exception as e:
            decky_plugin.logger.error(f"Error getting TTL values: {str(e)}")
            return {
                "success": False,
                "result": f"Failed to get TTL values: {str(e)}"
            }

    async def set(self, ttl):
        try:
            # Set IPv4 TTL
            subprocess.run(['sysctl', '-w', f'net.ipv4.ip_default_ttl={ttl}'], check=True)

            # Set IPv6 TTL
            subprocess.run(['sysctl', '-w', f'net.ipv6.conf.all.hop_limit={ttl}'], check=True)

            return {
                "success": True
            }
        except Exception as e:
            decky_plugin.logger.error(f"Error setting TTL value: {str(e)}")
            return {
                "success": False,
                "result": f"Failed to set TTL value: {str(e)}"
            }

    # Asyncio-compatible long-running code, executed in a task when the plugin is loaded
    async def _main(self):
        decky_plugin.logger.info("Change TTL Plugin loaded")

    # Function called first during the unload process
    async def _unload(self):
        decky_plugin.logger.info("Change TTL Plugin unloaded")

    # Function called during uninstall
    async def _uninstall(self):
        decky_plugin.logger.info("Change TTL Plugin uninstalled")
